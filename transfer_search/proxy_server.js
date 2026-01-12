const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const TARGET_HOST = 'demo.apps.easygds.com';
const TARGET_BASE = 'https://' + TARGET_HOST;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // Enable CORS for all requests just in case
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    // Proxy API requests
    if (pathname.startsWith('/api/')) {
        const proxyOptions = {
            hostname: TARGET_HOST,
            port: 443,
            path: req.url, // Keep the full path including search/query string
            method: req.method,
            headers: {
                ...req.headers,
                'host': TARGET_HOST, // Spoof the host header
                'origin': TARGET_BASE, // Spoof origin
                'referer': TARGET_BASE + '/' // Spoof referer
            }
        };

        // Remove headers that might cause issues
        delete proxyOptions.headers['host'];
        proxyOptions.headers['Host'] = TARGET_HOST;

        const proxyReq = https.request(proxyOptions, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, {
                ...proxyRes.headers,
                'access-control-allow-origin': '*' // Force CORS allowance on response
            });

            proxyRes.pipe(res, {
                end: true
            });
        });

        proxyReq.on('error', (e) => {
            console.error(`Problem with proxy request: ${e.message}`);
            res.writeHead(500);
            res.end(`Proxy Error: ${e.message}`);
        });

        req.pipe(proxyReq, {
            end: true
        });

    } else {
        // Serve Static Files
        let filePath = '.' + pathname;
        if (filePath === './') {
            filePath = './transfer_search_form.html';
        }

        const extname = path.extname(filePath);
        let contentType = MIME_TYPES[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found: ' + filePath);
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + err.code);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`\n>>> Proxy Server running at http://localhost:${PORT}/`);
    console.log(`>>> Proxies /api requests to ${TARGET_BASE}/api`);
    console.log(`>>> Open http://localhost:${PORT}/transfer_search_form.html to test.\n`);
});
