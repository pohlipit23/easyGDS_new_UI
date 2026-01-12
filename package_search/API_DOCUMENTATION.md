# Flight + Hotel (Package) Search Integration Guide

This directory contains a standalone Flight + Hotel search form integrated with the EasyGDS Booking Engine API.

## 📂 Directory Structure

- **package_search_form.html**: The complete, standalone booking form.
- **proxy_server.js**: A local Node.js server to handle CORS for API requests during development.

## 🚀 Quick Start

1.  **Start the Proxy Server:**
    ```bash
    node proxy_server.js
    ```

2.  **Open the Form:**
    Access the form via the proxy server:
    [http://localhost:3001/package_search/package_search_form.html](http://localhost:3001/package_search/package_search_form.html)

3.  **Search:**
    - Select Origin & Destination.
    - select Dates.
    - Optionally toggle **Partial Hotel Dates** to specify different hotel dates.
    - Configure Travelers & Rooms (Adults, Children, Infants per room).
    - Click **Search Packages**.

## ⚙️ Configuration

```javascript
const API_BASE_URL = '/api'; // Routes through local proxy
const SESSION_ID = 'demo_session_dynamic_123';
const CONFIG_ID = 'aaa34775-f480-477c-a656-f7a9a07ce605'; // Package Bundle ID
```

## 📡 API Endpoints Used

### 1. Autocomplete (Locations)
- **Endpoint:** `/api/places` (via Proxy)
- **Method:** `GET`
- **Purpose:** Fetches cities and airports.
- **Parameters:**
    - `search_text`: User input
    - `types`: `country,airport,administrative_area_level_4`
    - `with_properties`: `true` (can include hotels if needed)

### 2. Search Submission (Redirect)
- **Target:** `https://demo.apps.easygds.com/shopping/processes/bundle`
- **Method:** GET (URL Redirection)
- **Key Parameters:**
    - `process`: `bundle`
    - `package_id`: `aaa34775-f480-477c-a656-f7a9a07ce605`
    - `place_type`: `airport`
    - `place_id`: Destination Numeric ID (e.g. 4998477)
    - `is_separate`: `true`/`false` (Partial Hotel logic)
    - `expectation`: JSON string containing:
        - `start_place_code`: Origin IATA
        - `des_code`: Destination IATA
        - `fl_departure_date`, `fl_return_date`
        - `ht_checkin_date`, `ht_checkout_date`
        - `fl_cabin_class`
    - `travelers`: JSON string defining passengers per room:
        - `[{ type: 'adult', age: 30, room: 1 }, { type: 'child', age: 8, room: 1 }]`

## 🛠 Dependencies
- **Tailwind CSS**
- **Lucide Icons**
- **Flatpickr**
