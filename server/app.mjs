import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { InputError, HttpError, uuid, str, validPassword, normalizedEmail, hashPassword, verifyPassword, token, digest, validateFarm, validateCrop, validateExpense, validateGuide, validateCase, jsonRecord } from './core.mjs';

const ROOT=resolve(fileURLToPath(new URL('..',import.meta.url)));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const LIMIT=128*1024;
const sessionHours=12;
const badLogin=new Map();
const columns={farms:'id,name,village,area_acres AS "areaAcres",irrigation',crops:'id,farm_id AS "farmId",name,to_char(sown_date,\'YYYY-MM-DD\') AS "sownDate",status,expected_yield_kg AS "expectedYieldKg",expected_price_per_kg AS "expectedPricePerKg",actual_revenue AS "actualRevenue"',expenses:'id,crop_id AS "cropId",category,description,amount,to_char(date,\'YYYY-MM-DD\') AS date'};
const send=(res,status,data,headers={})=>{if(res.writableEnded)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...headers});res.end(JSON.stringify(data));};
const failed=(status,message)=>{throw new HttpError(status,message);};
const getCookie=req=>{const parts=(req.headers.cookie||'').split(';').map(s=>s.trim());const pair=parts.find(p=>p.startsWith('tnf_session='));return pair?pair.slice('tnf_session='.length):null;};
async function readBody(req){let bytes=0;const chunks=[];for await(const c of req){bytes+=c.length;if(bytes>LIMIT)throw new HttpError(413,'Request too large');chunks.push(c);}let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new InputError('Expected JSON body');}if(!data||typeof data!=='object'||Array.isArray(data))throw new InputError('Expected object body');return data;}
const limitLogin=req=>{const ip=req.socket.remoteAddress||'unknown',now=Date.now(),old=badLogin.get(ip)||[];const recent=old.filter(time=>now-time<15*60*1000);if(recent.length>=15)failed(429,'Too many authentication attempts; try later');recent.push(now);badLogin.set(ip,recent);if(badLogin.size>5000)badLogin.clear();};
const requireId=v=>{if(!uuid(v))throw new InputError('Invalid identifier');return v;};
const roles=(user,allowed)=>{if(!allowed.includes(user.role))failed(403,'Insufficient permissions');};
function cookie(value,secure){return 'tnf_session='+value+'; Path=/; HttpOnly; SameSite=Strict; Max-Age='+sessionHours*3600+(secure?'; Secure':'');}
async function query(pool,sql,values=[]){return pool.query(sql,values);}
async function currentUser(req,pool){const raw=getCookie(req);if(!raw||raw.length>200)return null;const r=await query(pool,`SELECT u.id,u.email,u.display_name AS "displayName",u.role,s.csrf_token AS "csrfToken" FROM tnf_sessions s JOIN tnf_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()`,[digest(raw)]);return r.rows[0]||null;}
async function audit(pool,user,action,target,targetId){await query(pool,'INSERT INTO tnf_audit(actor_id,action,target,target_id) VALUES ($1,$2,$3,$4)',[user?.id||null,action,target,targetId||null]);}
function farmData(payload){const v=validateFarm(payload);return [v.name,v.village,v.areaAcres,v.irrigation];}
function cropData(payload){const v=validateCrop(payload);return [v.farmId,v.name,v.sownDate,v.status,v.expectedYieldKg,v.expectedPricePerKg,v.actualRevenue];}
function expenseData(payload){const v=validateExpense(payload);return [v.cropId,v.category,v.description,v.amount,v.date];}
function caseData(payload){return validateCase(payload);}
function one(res,r){if(!r.rowCount)failed(404,'Record not found');send(res,200,{ok:true});}
function publicUser(user){return {id:user.id,email:user.email,displayName:user.displayName,role:user.role};}
const guidesSql=`SELECT g.id,g.title,g.locale,g.crop,g.region,g.summary,g.instructions,g.source_url AS "sourceUrl",g.source_name AS "sourceName",g.status,g.author_id AS "authorId",g.reviewer_id AS "reviewerId",g.version,g.reviewed_at AS "reviewedAt",g.published_at AS "publishedAt",g.created_at AS "createdAt" FROM tnf_guides g`;

export function createApp({pool,origin='http://127.0.0.1:8787',allowRegistration=false}={}){
 if(!pool||typeof pool.query!=='function')throw new Error('Database pool required');
 const site=new URL(origin);
 if(!['http:','https:'].includes(site.protocol)||site.username||site.password||site.pathname!=='/')throw new Error('Invalid PUBLIC_ORIGIN');
 if(process.env.NODE_ENV==='production'&&site.protocol!=='https:')throw new Error('Production requires HTTPS PUBLIC_ORIGIN');
 const secure=site.protocol==='https:';
 return async function handler(req,res){
  try{
   res.setHeader('x-frame-options','DENY');res.setHeader('referrer-policy','no-referrer');res.setHeader('x-content-type-options','nosniff');res.setHeader('permissions-policy','camera=(), microphone=(), geolocation=()');
   const url=new URL(req.url||'/',site);const path=url.pathname;const method=req.method||'GET';
   if(path.startsWith('/api/')){
    if(!['GET','POST','PATCH','DELETE'].includes(method))failed(405,'Method not allowed');
    if(!['GET','HEAD'].includes(method)){
     if(req.headers.origin!==site.origin)failed(403,'Request origin rejected');
     if(!(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))failed(415,'Send application/json');
    }
    if(path==='/api/health'&&method==='GET'){await query(pool,'SELECT 1');return send(res,200,{status:'ok',database:'connected'});}
    if(path==='/api/auth/register'&&method==='POST'){
     if(!allowRegistration)failed(403,'Registration is disabled. Contact the pilot administrator.');
     limitLogin(req);const b=await readBody(req),email=normalizedEmail(b.email),password=validPassword(b.password),name=str(b.displayName,'name',100),passwordHash=await hashPassword(password);const id=randomUUID();
     try{await query(pool,'INSERT INTO tnf_users(id,email,password_hash,display_name) VALUES($1,$2,$3,$4)',[id,email,passwordHash,name]);}catch(error){if(error.code==='23505')failed(409,'Email already registered');throw error;}
     await audit(pool,{id},'account.register','user',id);return send(res,201,{ok:true,message:'Account created. Sign in to continue.'});
    }
    if(path==='/api/auth/login'&&method==='POST'){
     limitLogin(req);const b=await readBody(req);let email;try{email=normalizedEmail(b.email);}catch{failed(401,'Invalid email or password');}const password=typeof b.password==='string'?b.password:'';
     const found=await query(pool,'SELECT id,email,display_name AS "displayName",role,password_hash FROM tnf_users WHERE email=$1',[email]);const user=found.rows[0];const valid=user?await verifyPassword(password,user.password_hash):(await hashPassword('unused-credential-padding'),false);
     if(!valid)failed(401,'Invalid email or password');
     const secret=token(),csrf=token();await query(pool,"INSERT INTO tnf_sessions(token_hash,user_id,csrf_token,expires_at) VALUES($1,$2,$3,now()+interval '12 hours')",[digest(secret),user.id,csrf]);await audit(pool,user,'auth.login','user',user.id);
     return send(res,200,{user:publicUser(user),csrfToken:csrf},{'set-cookie':cookie(secret,secure)});
    }
    const user=await currentUser(req,pool);
    if(path==='/api/auth/me'&&method==='GET')return send(res,200,{user:user?publicUser(user):null,csrfToken:user?.csrfToken||null,registrationAvailable:allowRegistration});
    if(!user)failed(401,'Sign in required');
    if(method!=='GET'&&req.headers['x-csrf-token']!==user.csrfToken)failed(403,'Security token missing or invalid');
    if(path==='/api/auth/logout'&&method==='POST'){await query(pool,'DELETE FROM tnf_sessions WHERE token_hash=$1',[digest(getCookie(req))]);return send(res,200,{ok:true},{'set-cookie':cookie('',secure).replace(/Max-Age=\d+/,'Max-Age=0')});}
    if(path==='/api/snapshot'&&method==='GET'){
     const [farms,crops,expenses]=await Promise.all([
      query(pool,'SELECT '+columns.farms+' FROM tnf_farms WHERE user_id=$1 ORDER BY created_at DESC',[user.id]),
      query(pool,'SELECT '+columns.crops+' FROM tnf_crops WHERE user_id=$1 ORDER BY created_at DESC',[user.id]),
      query(pool,'SELECT '+columns.expenses+' FROM tnf_expenses WHERE user_id=$1 ORDER BY date DESC,created_at DESC',[user.id])
     ]);
     return send(res,200,{version:1,farms:farms.rows.map(jsonRecord),crops:crops.rows.map(jsonRecord),expenses:expenses.rows.map(jsonRecord)});
    }
    const f=path.match(/^\/api\/(farms|crops|expenses)(?:\/([^/]+))?$/);
    if(f){
     const [_,table,id]=f;const actual={'farms':'tnf_farms','crops':'tnf_crops','expenses':'tnf_expenses'}[table];
     if(id)requireId(id);
     if(method==='POST'&&!id){const b=await readBody(req),newId=randomUUID();let sql,values;
      if(table==='farms'){values=farmData(b);sql='INSERT INTO tnf_farms(id,user_id,name,village,area_acres,irrigation) VALUES($1,$2,$3,$4,$5,$6)';}
      if(table==='crops'){values=cropData(b);sql='INSERT INTO tnf_crops(id,user_id,farm_id,name,sown_date,status,expected_yield_kg,expected_price_per_kg,actual_revenue) SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9 WHERE EXISTS (SELECT 1 FROM tnf_farms WHERE id=$3 AND user_id=$2)';}
      if(table==='expenses'){values=expenseData(b);sql='INSERT INTO tnf_expenses(id,user_id,crop_id,category,description,amount,date) SELECT $1,$2,$3,$4,$5,$6,$7 WHERE EXISTS (SELECT 1 FROM tnf_crops WHERE id=$3 AND user_id=$2)';}
      const r=await query(pool,sql,[newId,user.id,...values]);if(!r.rowCount)failed(404,'Related record not found');await audit(pool,user,table+'.create',table,newId);return send(res,201,{id:newId});
     }
     if(method==='PATCH'&&id){const b=await readBody(req);let sql,values;
      if(table==='farms'){values=farmData(b);sql='UPDATE tnf_farms SET name=$3,village=$4,area_acres=$5,irrigation=$6 WHERE id=$1 AND user_id=$2';}
      if(table==='crops'){values=cropData(b);sql='UPDATE tnf_crops SET farm_id=$3,name=$4,sown_date=$5,status=$6,expected_yield_kg=$7,expected_price_per_kg=$8,actual_revenue=$9 WHERE id=$1 AND user_id=$2 AND EXISTS(SELECT 1 FROM tnf_farms WHERE id=$3 AND user_id=$2)';}
      if(table==='expenses'){values=expenseData(b);sql='UPDATE tnf_expenses SET crop_id=$3,category=$4,description=$5,amount=$6,date=$7 WHERE id=$1 AND user_id=$2 AND EXISTS(SELECT 1 FROM tnf_crops WHERE id=$3 AND user_id=$2)';}
      const r=await query(pool,sql,[id,user.id,...values]);if(!r.rowCount)failed(404,'Record or linked farm/crop not found');await audit(pool,user,table+'.update',table,id);return send(res,200,{ok:true});
     }
     if(method==='DELETE'&&id){const r=await query(pool,'DELETE FROM '+actual+' WHERE id=$1 AND user_id=$2',[id,user.id]);if(!r.rowCount)failed(404,'Record not found');await audit(pool,user,table+'.delete',table,id);return send(res,200,{ok:true});}
     failed(405,'Unsupported operation');
    }
    if(path==='/api/guides'&&method==='GET'){const elevated=['expert','editor','admin'].includes(user.role),r=await query(pool,guidesSql+(elevated?' ORDER BY g.created_at DESC':" WHERE g.status='published' ORDER BY g.published_at DESC"));return send(res,200,{guides:r.rows});}
    if(path==='/api/guides'&&method==='POST'){
     roles(user,['expert','editor','admin']);const b=validateGuide(await readBody(req)),id=randomUUID();await query(pool,'INSERT INTO tnf_guides(id,title,locale,crop,region,summary,instructions,source_url,source_name,author_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[id,b.title,b.locale,b.crop,b.region,b.summary,b.instructions,b.sourceUrl,b.sourceName,user.id]);await audit(pool,user,'guide.draft','guide',id);return send(res,201,{id,status:'draft'});
    }
    const guide=path.match(/^\/api\/guides\/([^/]+)\/(submit|publish|withdraw)$/);
    if(guide&&method==='POST'){
     const id=requireId(guide[1]),action=guide[2];roles(user,action==='submit'?['expert','editor','admin']:['editor','admin']);let sql,values=[id];
     if(action==='submit'){sql="UPDATE tnf_guides SET status='in_review',updated_at=now() WHERE id=$1 AND author_id=$2 AND status='draft'";values.push(user.id);}
     if(action==='publish'){const b=await readBody(req);if(b.confirmExpertReview!==true)throw new InputError('Confirm independent expert source review');sql="UPDATE tnf_guides SET status='published',reviewer_id=$2,reviewed_at=now(),published_at=now(),updated_at=now() WHERE id=$1 AND status='in_review' AND author_id<>$2";values.push(user.id);}
     if(action==='withdraw'){sql="UPDATE tnf_guides SET status='withdrawn',updated_at=now() WHERE id=$1 AND status='published'";}
     const r=await query(pool,sql,values);if(!r.rowCount)failed(409,'Guide state or independent-review rule prevents action');await audit(pool,user,'guide.'+action,'guide',id);return send(res,200,{ok:true});
    }
    if(path==='/api/cases'&&method==='GET'){
     const expert=['expert','admin'].includes(user.role);const r=await query(pool,`SELECT id,farmer_id AS "farmerId",crop_id AS "cropId",subject,symptoms,status,reply,reply_source_url AS "replySourceUrl",created_at AS "createdAt",answered_at AS "answeredAt" FROM tnf_cases `+(expert?'ORDER BY created_at DESC':'WHERE farmer_id=$1 ORDER BY created_at DESC'),expert?[]:[user.id]);return send(res,200,{cases:r.rows});
    }
    if(path==='/api/cases'&&method==='POST'){
     const b=caseData(await readBody(req)),id=randomUUID();const r=await query(pool,'INSERT INTO tnf_cases(id,farmer_id,crop_id,subject,symptoms) SELECT $1,$2,$3,$4,$5 WHERE $3::uuid IS NULL OR EXISTS(SELECT 1 FROM tnf_crops WHERE id=$3 AND user_id=$2)',[id,user.id,b.cropId,b.subject,b.symptoms]);if(!r.rowCount)failed(404,'Crop not found');await audit(pool,user,'case.create','case',id);return send(res,201,{id,status:'open'});
    }
    const respond=path.match(/^\/api\/cases\/([^/]+)\/respond$/);
    if(respond&&method==='POST'){
     roles(user,['expert','admin']);const id=requireId(respond[1]),b=await readBody(req),reply=str(b.reply,'reply',4000),source=str(b.sourceUrl,'source URL',1000);let sourceUrl;try{sourceUrl=new URL(source);if(sourceUrl.protocol!=='https:')throw new Error();}catch{throw new InputError('HTTPS source URL required');}
     const r=await query(pool,"UPDATE tnf_cases SET status='answered',reply=$2,reply_source_url=$3,answered_by=$4,answered_at=now() WHERE id=$1 AND status='open'",[id,reply,source,user.id]);if(!r.rowCount)failed(404,'Open case not found');await audit(pool,user,'case.respond','case',id);return send(res,200,{ok:true});
    }
    failed(404,'Unknown API endpoint');
   }
   if(method!=='GET'&&method!=='HEAD')failed(405,'Method not allowed');
   const allowed=path==='/'?'portal/index.html':path==='/offline'?'index.html':path.slice(1);
   if(!/^(portal\/(index\.html|app\.js|style\.css)|src\/(app|math|store|content)\.js|styles\.css|favicon\.svg|index\.html)$/.test(allowed))failed(404,'Not found');
   const target=resolve(ROOT,allowed);if(!target.startsWith(ROOT+sep))failed(403,'Forbidden');const extension=extname(target);const content=await readFile(target);
   res.writeHead(200,{'content-type':MIME[extension]||'application/octet-stream','cache-control':'no-store','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",'x-content-type-options':'nosniff'});if(method==='HEAD')res.end();else res.end(content);
  }catch(error){const status=error.status|| (error.code==='23503'?404:500);if(status===500)console.error('[tnf-api]',error);send(res,status,{error:status===500?'Internal server error':error.message});}
 };
}
