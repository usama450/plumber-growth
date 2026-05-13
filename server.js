const http = require('http');
const fs   = require('fs');
const path = require('path');

const DIR  = __dirname;
const PORT = 3000;
const MIME = {
  html: 'text/html',
  mp4:  'video/mp4',
  js:   'text/javascript',
  css:  'text/css',
  png:  'image/png',
  jpg:  'image/jpeg',
};

http.createServer((req, res) => {
  const filePath = path.join(DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext      = filePath.split('.').pop();
  const mimeType = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stat) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }

    // Range requests — required for <video> to seek/stream
    const range = req.headers.range;
    if (range && ext === 'mp4') {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end   = endStr ? parseInt(endStr, 10) : stat.size - 1;
      const chunk = end - start + 1;
      res.writeHead(206, {
        'Content-Range':  `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges':  'bytes',
        'Content-Length': chunk,
        'Content-Type':   mimeType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': mimeType, 'Content-Length': stat.size });
      fs.createReadStream(filePath).pipe(res);
    }
  });
}).listen(PORT, () => {
  console.log(`\n  Local server running at http://localhost:${PORT}\n`);
});
