# Transfer Search Integration Guide

This guide details the API dependencies and URL construction required to reproduce the Transfer Search functionality.

## 1. CORS Proxy Server Setup (REQUIRED)

To avoid Cross-Origin Resource Sharing (CORS) errors when browsing locally and calling the remote API (`demo.apps.easygds.com`), you **must** run a local proxy server.

### `proxy_server.js` (Root of Transfer Search)
Save this as `proxy_server.js` in your project folder. (Already provided in this folder)

### Running the Server
1. Ensure you have Node.js installed.
2. Run the command:
   ```bash
   node proxy_server.js
   ```
3. Access the Transfer Search form at:
   `http://localhost:3001/transfer_search_form.html`

***

## 2. Location Autocomplete API

To fetch Airports, Cities, and Hotels, use the `/places` endpoint.

**Endpoint 1: Airports:** `GET /places/cities-with-airports`
- `search_text`: Query
- `language_code`: `en-US`
- Returns: List of airports/cities with codes.

**Endpoint 2: Places/Hotels:** `GET /places`
- `search_text`: Query
- `types`: `country,airport,administrative_area_level_4,administrative_area_level_3`
- `property_included`: `false`
- `with_properties`: `true`
- `has_code`: `false`
- Returns: `places` (geo locations) and `properties` (hotels).

---

## 3. Search Redirection (Form Submit)

The search form redirects the user to the `demo.apps.easygds.com` application.

### Base URL
`https://demo.apps.easygds.com/shopping/processes/transfer`

### Required Query Parameters

| Parameter | Value / Description |
|-----------|-------------------|
| `process` | `transfer` |
| `package_id` | `7bf47e3c-8951-4016-9190-d813047b3939` |
| `currency_code` | `EUR` |
| `language_code` | `en-US` |
| `session_id` | Unique Session ID |
| `office_domain` | `demo.b2c.easygds.com` |
| `scope_type` | `B2C` |
| `disabled_currency` | `true` |
| `search_id` | Random hex string. |
| `expectation` | (JSON String) Search criteria details (see below). |
| `travelers` | (JSON String) Traveler configuration. |

### `expectation` JSON Object

```json
{
  "is_separate": false,
  "tf_airport_code": "LHR", // Airport IATA Code
  "tf_from_airport": true,  // true = Airport -> Hotel, false = Hotel -> Airport
  "tf_pickup_date": "2026-01-29",
  "tf_pickup_time": "12:00",
  "tf_place_code": "27158", // Place ID or Property ID
  "tf_place_type": "place_id", // "place_id" or "property_id"
  "tf_return_date": null,
  "tf_return_time": null,
  "tf_round_trip": false
}
```

### `travelers` JSON Array
```json
[
  { "type": "adult", "age": 30, "room": 1 }
]
```

## Example Generated URL

```
https://demo.apps.easygds.com/shopping/processes/transfer?process=transfer&package_id=7bf47e3c-8951-4016-9190-d813047b3939&expectation=%7B...%7D&travelers=%5B...%7D&currency_code=EUR&language_code=en-US&session_id=...&office_domain=demo.b2c.easygds.com&scope_type=B2C
```
