many changes
# Hotel Search Integration Guide

This guide details the API dependencies and URL construction required to reproduce the Hotel Search functionality.

## 1. CORS Proxy Server Setup (REQUIRED)

To avoid Cross-Origin Resource Sharing (CORS) errors when browsing locally and calling the remote API (`demo.apps.easygds.com`), you **must** run a local proxy server.

### `proxy_server.js` (Root Directory)
Save this as `proxy_server.js` in the root of your project:

```javascript
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

        // Ensure Host header is correct for correct routing at target
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
        // Default to listing content or picking specific file if you wish
        if (filePath === './') {
            filePath = './index.html'; 
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
});
```

### Running the Server
1. Ensure you have Node.js installed.
2. Run the command:
   ```bash
   node proxy_server.js
   ```
3. Access the Hotel Search form at:
   `http://localhost:3001/hotel_search/hotel_search_form.html`

***

## 2. Location Autocomplete API

To fetch destinations (Cities, Regions) and Specific Hotels, use the `/places` endpoint.

**Endpoint:** `GET /places` (Proxied to API)

**Parameters:**
- `search_text`: (String) The user's input query (min 3 chars recommended).
- `language_code`: `en-US`
- `types`: `country,airport,administrative_area_level_4,administrative_area_level_3`
- `property_included`: `false`
- `with_properties`: `true` (Important: Includes specific hotels in results)
- `has_code`: `false`
- `per_page`: `20`
- `page`: `1`

**Response Structure (JSON):**
The response contains two main arrays:
1. `places`: Geographic locations.
   - `id`: Unique Identifier (Use this for `place_id`).
   - `name`: Display Name.
   - `location.country_code`: Country.
2. `properties`: Specific Hotels.
   - `id` or `hotel_id`: Unique Identifier.
   - `name`: Hotel Name.
   - `star`: Star rating.

---

## 3. Search Redirection (Form Submit)

The search form does not call an API to get results directly; instead, it redirects the user to the `demo.apps.easygds.com` application with a payload of parameters in the URL query string.

### Base URL
- **General Search:** `https://demo.apps.easygds.com/shopping/processes/hotel`
- **Specific Hotel:** `https://demo.apps.easygds.com/shopping/products/hotel/{HOTEL_ID}`

### Required Query Parameters

| Parameter | Value / Description |
|-----------|-------------------|
| `process` | `hotel` |
| `place_type` | `hotel` (if specific hotel) or `administrative_area_level_4` (if city/region) |
| `place_id` | The `id` from the Autocomplete API. |
| `package_id` | `4a5c9770-f901-4b96-8673-ecdc5ee49102` |
| `currency_code` | `USD` |
| `language_code` | `en-US` |
| `session_id` | Unique Session ID (e.g., `demo_session...`) |
| `office_domain` | `demo.b2c.easygds.com` |
| `scope_type` | `B2C` |
| `show_crew_booking` | `true` |
| `is_crew_booking` | `false` |
| `search_id` | A random 32-char hex string (16 bytes). |
| `expectation` | (JSON String) Search criteria details (see below). |
| `travelers` | (JSON String) Traveler configuration (see below). |

### `expectation` JSON Object
Use `JSON.stringify()` to encode this object into the URL.

#### For Specific Hotel
```json
{
  "ht_des_code": "1486134",        // Hotel ID
  "ht_des_type": "property_id",
  "ht_checkin_date": "2026-01-29", // YYYY-MM-DD
  "ht_checkout_date": "2026-01-30",// YYYY-MM-DD
  "is_separate": true
}
```

#### For Destination (City)
```json
{
  "ht_des_code": "2766",           // Place ID
  "ht_des_type": "place_id",
  "ht_checkin_date": "2026-01-29",
  "ht_checkout_date": "2026-01-30",
  "is_separate": false
}
```

### `travelers` JSON Array
Use `JSON.stringify()` to encode this array.

```json
[
  {
    "type": "adult",
    "age": 30,
    "room": 1
  },
  {
    "type": "adult", 
    "age": 30, 
    "room": 1
  }
]
```

## Example Generated URL

```
https://demo.apps.easygds.com/shopping/products/hotel/1486134?process=hotel&place_type=hotel&place_id=1486134&currency_code=USD&language_code=en-US&package_id=4a5c9770-f901-4b96-8673-ecdc5ee49102&expectation=%7B...%7D&travelers=%5B...%7D&flight_campaign=&partner_id=&show_crew_booking=true&is_crew_booking=false&session_id=...&office_domain=demo.b2c.easygds.com&scope_type=B2C&search_id=...
```
