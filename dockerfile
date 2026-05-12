FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

# Copy static client assets
COPY --chown=node:node --from=builder /app/.output/client ./public

# Create simple static file server
RUN cat <<'EOF' > server.js

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;

const BASE_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function serveFile(filePath, req, res) {
  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

http.createServer(async (req, res) => {
  const pathname = url.parse(req.url, true).pathname;
  let filePath;

  if (pathname === '/') {
    filePath = path.join(BASE_DIR, 'index.html');
  } else {
    filePath = path.join(BASE_DIR, pathname);
  }

  // Prevent directory traversal
  if (filePath.indexOf(BASE_DIR) !== 0) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext) {
    // Serve static asset or 404
    await serveFile(filePath, req, res);
  } else {
    // SPA fallback to index.html
    await serveFile(path.join(BASE_DIR, 'index.html'), req, res);
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
EOF

RUN chown node:node server.js

USER node

EXPOSE 3000

CMD ["node", "server.js"]
