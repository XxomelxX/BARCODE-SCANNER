# QuaggaJS Mobile Scanner

A simple web-based barcode scanner using QuaggaJS, with a reliable local server and camera support.

## Run locally

1. Open PowerShell in `C:\QuaggaJS`.
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the app:
   ```powershell
   npm start
   ```

## Access the app

- On your laptop: `https://localhost:8443`
- On your mobile device: Use the HTTPS tunnel URL shown when starting the server (e.g., `https://*.serveousercontent.com`)

The tunnel URL is generated each time and provides a valid HTTPS certificate, so no security warnings on mobile.

## Browser and camera notes

- Use a modern browser: Chrome on Android, Safari on iOS.
- Allow camera access when prompted.
- If the camera still fails, refresh the page or try another browser.

## Supported barcode types

- EAN-13
- EAN-8
- UPC-A
- UPC-E
- Code 128
- Code 39
- Codabar
- Interleaved 2 of 5
