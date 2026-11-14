import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export const ROLES = ['farmer', 'expert', 'editor', 'admin'];
export const IRRIGATION = ['Rainfed', 'Well', 'Borewell', 'Canal', 'Drip', 'Other'];
export const STATUSES = ['planned', 'growing', 'harvested'];
export const CATEGORIES = ['Seed & seedlings', 'Fertilizer & nutrients', 'Water & electricity', 'Labour', 'Crop protection', 'Transport', 'Machinery', 'Other'];
export const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export const str = (value, label, max, {required=true}={}) => { if(typeof value !== 'string' || value.length>max || (required && !value.trim())) throw new InputError('Invalid ' + label); return value.trim(); };
export const number = (value, label, max=1e12, min=0) => { if(typeof value!=='number' || !Number.isFinite(value) || value<min || value>max) throw new InputError('Invalid '+label); return value; };
export const optionalRevenue = value => value === null || value === undefined ? null : number(value,'actual revenue');
export const date = value => { if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value+'T12:00:00Z')) || new Date(value+'T12:00:00Z').toISOString().slice(0,10)!==value) throw new InputError('Invalid date'); return value; };
export const choice = (value, allowed, label) => {if(!allowed.includes(value))throw new InputError('Invalid '+label);return value;};
export class InputError extends Error {constructor(message){super(message);this.status=400;}}
export class HttpError extends Error {constructor(status,message){super(message);this.status=status;}}
export function validateFarm(body){return {name:str(body?.name,'farm name',100),village:str(body?.village??'','village',100,{required:false}),areaAcres:number(body?.areaAcres,'area',100000,0.000001),irrigation:choice(body?.irrigation,IRRIGATION,'irrigation')};}
export function validateCrop(body){if(!uuid(body?.farmId))throw new InputError('Invalid farm id');return {farmId:body.farmId,name:str(body?.name,'crop name',100),sownDate:date(body?.sownDate),status:choice(body?.status,STATUSES,'status'),expectedYieldKg:number(body?.expectedYieldKg,'expected yield'),expectedPricePerKg:number(body?.expectedPricePerKg,'expected price'),actualRevenue:optionalRevenue(body?.actualRevenue)};}
export function validateExpense(body){if(!uuid(body?.cropId))throw new InputError('Invalid crop id');return {cropId:body.cropId,category:choice(body?.category,CATEGORIES,'category'),description:str(body?.description??'','description',180,{required:false}),amount:number(body?.amount,'amount'),date:date(body?.date)};}
export function validateGuide(body){const url=str(body?.sourceUrl,'source URL',1000);let parsed;try{parsed=new URL(url);}catch{throw new InputError('Invalid source URL');}if(parsed.protocol!=='https:')throw new InputError('Source must use HTTPS');return {title:str(body?.title,'guide title',140),locale:choice(body?.locale,['en','mr','hi'],'locale'),crop:str(body?.crop,'crop',80),region:str(body?.region,'region',150),summary:str(body?.summary,'summary',800),instructions:str(body?.instructions,'instructions',6000),sourceUrl:url,sourceName:str(body?.sourceName,'source name',160)};}
export function validateCase(body){return {cropId:body?.cropId===null || body?.cropId===undefined?null:(uuid(body.cropId)?body.cropId:(()=>{throw new InputError('Invalid crop id');})()),subject:str(body?.subject,'subject',160),symptoms:str(body?.symptoms,'symptoms',3000)};}
export function normalizedEmail(value){const email=str(value,'email',254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new InputError('Invalid email');return email;}
export function validPassword(p){if(typeof p!=='string'||p.length<12||Buffer.byteLength(p,'utf8')>1024)throw new InputError('Password must be 12–128+ characters (max 1024 bytes)');return p;}
export const token = () => randomBytes(32).toString('base64url');
export const digest = value => createHash('sha256').update(value).digest('hex');
export async function hashPassword(password){validPassword(password);const salt=randomBytes(16).toString('hex');const hash=await scrypt(password,Buffer.from(salt,'hex'),64,{N:16384,r:8,p:1,maxmem:64*1024*1024});return 'scrypt$16384$8$1$'+salt+'$'+hash.toString('hex');}
export async function verifyPassword(password,encoded){try{const [algorithm,n,r,p,salt,key]=encoded.split('$');if(algorithm!=='scrypt'||n!=='16384'||r!=='8'||p!=='1'||!(/^[0-9a-f]{32}$/.test(salt))||!(/^[0-9a-f]{128}$/.test(key)))return false;const derived=await scrypt(password,Buffer.from(salt,'hex'),64,{N:16384,r:8,p:1,maxmem:64*1024*1024});return timingSafeEqual(Buffer.from(key,'hex'),derived);}catch{return false;}}
export function jsonRecord(row){if(!row)return null;return Object.fromEntries(Object.entries(row).map(([k,v])=>[k, v instanceof Date ? v.toISOString().slice(0,10) : typeof v==='string'&&['areaAcres','expectedYieldKg','expectedPricePerKg','actualRevenue','amount'].includes(k)?Number(v):v]));}
