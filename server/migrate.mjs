import pg from 'pg';
import { readFile } from 'node:fs/promises';
const url=process.env.DATABASE_URL;
if(!url)throw new Error('DATABASE_URL is required. Never commit credentials.');
const client=new pg.Client({connectionString:url, ssl:process.env.PGSSL==='true'?{rejectUnauthorized:true}:undefined});
try{await client.connect();await client.query(await readFile(new URL('./migrations/001_initial.sql',import.meta.url),'utf8'));console.log('Database schema ready (001_initial.sql).');}finally{await client.end();}
