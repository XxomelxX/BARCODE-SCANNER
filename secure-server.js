const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const PORT_HTTPS = 8443;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Generate self-signed certificate
const { privateKey, certificate } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

const credentials = { key: privateKey, cert: certificate };

const requestHandler = (req, res) => {
  let requestPath = req.url.split('?')[0];
  if (requestPath === '/' || requestPath === '') {
    requestPath = '/index.html';
  }

  const resolvedPath = path.resolve(ROOT, '.' + requestPath);
  if (!resolvedPath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(resolvedPath).pipe(res);
  });
};

const server = https.createServer(credentials, requestHandler);

server.listen(PORT_HTTPS, '0.0.0.0', () => {
  console.log(`Local HTTPS server started at https://localhost:${PORT_HTTPS}`);

  // Start serveo tunnel
  const ssh = spawn('ssh', ['-R', '80:localhost:8443', 'serveo.net'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let tunnelUrl = '';

  ssh.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('serveo:', output.trim());
    const match = output.match(/https:\/\/[^\s]+/);
    if (match && !tunnelUrl) {
      tunnelUrl = match[0];
      console.log(`Secure HTTPS tunnel created: ${tunnelUrl}`);
      console.log('Open this HTTPS URL on your mobile device.');
    }
  });

  ssh.stderr.on('data', (data) => {
    console.error('serveo error:', data.toString().trim());
  });

  ssh.on('close', (code) => {
    console.log(`serveo process exited with code ${code}`);
    process.exit(0);
  });

  process.on('SIGINT', () => {
    ssh.kill();
    server.close();
  });
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});
