import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
const port = Number(process.env.PORT || 5173);
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
    const path = resolve(ROOT, '.' + pathname);
    if ((path !== ROOT && !path.startsWith(ROOT + sep)) || pathname.includes('\\') || pathname.startsWith('/.')) { res.writeHead(403); return res.end('Forbidden'); }
    const requested = path === ROOT ? resolve(ROOT, 'index.html') : path;
    const info = await stat(requested);
    if (!info.isFile() || !Object.hasOwn(MIME, extname(requested))) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': MIME[extname(requested)], 'x-content-type-options': 'nosniff', 'cache-control': 'no-store', 'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'" });
    res.end(await readFile(requested));
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log('The Next Farmer: http://127.0.0.1:' + port));
