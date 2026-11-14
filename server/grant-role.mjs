import pg from 'pg';
import { ROLES, normalizedEmail } from './core.mjs';
const [emailArg,role]=process.argv.slice(2);
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL required');
if(!emailArg||!ROLES.includes(role)||role==='farmer')throw new Error('Usage: npm run grant:role -- person@example.com expert|editor|admin');
const email=normalizedEmail(emailArg);
const client=new pg.Client({connectionString:process.env.DATABASE_URL,ssl:process.env.PGSSL==='true'?{rejectUnauthorized:true}:undefined});
try{await client.connect();const r=await client.query('UPDATE tnf_users SET role=$1 WHERE email=$2 RETURNING id,email,role',[role,email]);if(!r.rowCount)throw new Error('No such account: '+email);console.log('Role granted:',r.rows[0].email,r.rows[0].role);}finally{await client.end();}
