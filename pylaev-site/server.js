const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg',
  '.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml',
  '.ico':'image/x-icon'
};

http.createServer((req, res) => {
  let filePath = '.' + decodeURIComponent(req.url);
  if (filePath === './') filePath = './index.html';

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404);
      res.end('404');
      return;
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    if (range && ext === '.mp3') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      stream.pipe(res);
    } else {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('404');
          return;
        }
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileSize,
          'Cache-Control': 'no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      });
    }
  });
}).listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log('Нажми Ctrl+C для остановки');
});
