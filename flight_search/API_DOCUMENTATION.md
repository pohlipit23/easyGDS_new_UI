# Flight Search Integration Guide

This directory contains a standalone Flight Search form integrated with the EasyGDS Booking Engine API.

## 📂 Directory Structure

- **flight_search_form.html**: The complete, standalone booking form.
- **proxy_server.js**: A local Node.js server to handle CORS for API requests during development.

## 🚀 Quick Start

1.  **Start the Proxy Server:**
    Because the browser prevents direct API calls to external domains (CORS), you must run the local proxy.
    ```bash
    node proxy_server.js
    ```
    *Ensure you have Node.js installed.*

2.  **Open the Form:**
    Access the form via the proxy server:
    [http://localhost:3001/flight_search/flight_search_form.html](http://localhost:3001/flight_search/flight_search_form.html)

3.  **Search:**
    - Enter Origin (e.g., London, SIN, NYC).
    - Enter Destination (e.g., Paris, BKK, TYO).
    - Select Dates.
    - Configure Passengers (Adults, Children, Infants).
    - Click **Search Flights**.

    *The form will redirect you to the `demo.apps.easygds.com` results page.*

## ⚙️ Configuration

The form uses the following configuration constants (found in the `<script>` section):

```javascript
const API_BASE_URL = '/api'; // Routes through local proxy
const SESSION_ID = 'demo_session_dynamic_123';
const CONFIG_ID = '3dca0e8c-b1ec-4fef-913e-09b577956c6d'; // Flight Package ID
```

## 📡 API Endpoints Used

### 1. Autocomplete (Locations)
- **Endpoint:** `/api/places/cities-with-airports` (via Proxy)
- **Method:** `GET`
- **Purpose:** Fetches cities and airports for Origin/Destination fields.
- **Parameters:**
    - `search_text`: User input (min 3 chars)
    - `language_code`: `en-US`

### 2. Search Submission (Redirect)
- **Target:** `https://demo.apps.easygds.com/shopping/processes/flight`
- **Method:** GET (URL Redirection)
- **Key Parameters:**
    - `process`: `flight`
    - `package_id`: `3dca0e8c-b1ec-4fef-913e-09b577956c6d`
    - `expectation`: JSON string containing:
        - `start_place_code`: Origin IATA code
        - `des_code`: Destination IATA code
        - `fl_departure_date`: YYYY-MM-DD
        - `fl_return_date`: YYYY-MM-DD
    - `travelers`: JSON string defining passengers:
        - `[{ type: 'adult', age: 30, room: 1 }, ...]`

## 🛠Dependencies

The form is built with standard HTML/JS and uses:
- **Tailwind CSS** (via CDN) for styling.
- **Lucide Icons** (via CDN) for UI icons.
- **Flatpickr** (via CDN) for the date picker.

No build step is required. Just run the proxy and open the file.
