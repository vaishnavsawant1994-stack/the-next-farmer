import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { createApp } from '../server/app.mjs';

// This test requires a dedicated disposable PostgreSQL test database and a prior migration.
// It is skipped locally unless TNF_TEST_DATABASE_URL is explicitly provided.
test('PostgreSQL integration: separate farmer accounts cannot access each other records', {skip:!process.env.TNF_TEST_DATABASE_URL}, async()=>{
  const {default:pg}=await import('pg');
  const pool=new pg.Pool({connectionString:process.env.TNF_TEST_DATABASE_URL});
  let app;const server=createServer((req,res)=>app(req,res));server.listen(0,'127.0.0.1');await once(server,'listening');
  const origin=`http://127.0.0.1:${server.address().port}`;app=createApp({pool,origin,allowRegistration:true});
  const domain=randomUUID().slice(0,8), a=`a-${domain}@test.invalid`,b=`b-${domain}@test.invalid`;
  async function call(path,{method='GET',body,cookie,csrf}={}){const res=await fetch(origin+path,{method,headers:{...(body?{'content-type':'application/json'}:{}),...(method==='GET'?{}:{origin}),...(cookie?{cookie}:{}),...(csrf?{'x-csrf-token':csrf}:{})},body:body?JSON.stringify(body):undefined});return {status:res.status,body:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};}
  try{
    for(const email of [a,b]){const created=await call('/api/auth/register',{method:'POST',body:{email,password:'a secure 16+ character password',displayName:'Test Farmer'}});assert.equal(created.status,201,JSON.stringify(created.body));}
    const loginA=await call('/api/auth/login',{method:'POST',body:{email:a,password:'a secure 16+ character password'}});const loginB=await call('/api/auth/login',{method:'POST',body:{email:b,password:'a secure 16+ character password'}});
    assert.equal(loginA.status,200);assert.equal(loginB.status,200);
    const sa={cookie:loginA.cookie,csrf:loginA.body.csrfToken},sb={cookie:loginB.cookie,csrf:loginB.body.csrfToken};
    const farm=await call('/api/farms',{method:'POST',...sa,body:{name:'Field A',village:'',areaAcres:1.25,irrigation:'Drip'}});assert.equal(farm.status,201);
    const bobSnapshot=await call('/api/snapshot',sb);assert.equal(bobSnapshot.status,200);assert.equal(bobSnapshot.body.farms.length,0);
    const bobEdit=await call('/api/farms/'+farm.body.id,{method:'PATCH',...sb,body:{name:'Changed',village:'',areaAcres:2,irrigation:'Well'}});assert.equal(bobEdit.status,404);
    const bobCrop=await call('/api/crops',{method:'POST',...sb,body:{farmId:farm.body.id,name:'Onion',sownDate:'2026-11-14',status:'growing',expectedYieldKg:800,expectedPricePerKg:18,actualRevenue:null}});assert.equal(bobCrop.status,404);
    const aCrop=await call('/api/crops',{method:'POST',...sa,body:{farmId:farm.body.id,name:'Onion',sownDate:'2026-11-14',status:'growing',expectedYieldKg:800,expectedPricePerKg:18,actualRevenue:null}});assert.equal(aCrop.status,201,JSON.stringify(aCrop.body));
    const aExpense=await call('/api/expenses',{method:'POST',...sa,body:{cropId:aCrop.body.id,category:'Labour',description:'Test',amount:3500,date:'2026-11-14'}});assert.equal(aExpense.status,201);
    const bobExpense=await call('/api/expenses',{method:'POST',...sb,body:{cropId:aCrop.body.id,category:'Labour',description:'Test',amount:3500,date:'2026-11-14'}});assert.equal(bobExpense.status,404);
    const aSnapshot=await call('/api/snapshot',sa);assert.equal(aSnapshot.body.farms.length,1);assert.equal(aSnapshot.body.crops.length,1);assert.equal(aSnapshot.body.expenses[0].amount,3500);
  }finally{
    await pool.query('DELETE FROM tnf_users WHERE email = ANY($1::text[])',[[a,b]]).catch(()=>{});
    await new Promise(resolve=>server.close(resolve));await pool.end();
  }
});
