Aircraft Weight & Mission Fuel Planner — Offline mobile package

FILES
- index.html: the bilingual calculator
- manifest.webmanifest: app name, home-screen display and icons
- service-worker.js: caches the app for offline use after first successful load
- icons/: home-screen icons

INSTALL / USE
1. Extract this ZIP.
2. Put the extracted folder on an HTTPS web host or open it through a local web server.
3. Visit index.html in the phone browser while online once.
4. Android (Chrome/Edge): use the browser menu and choose "Install app" or "Add to Home screen".
5. iPhone/iPad (Safari): tap Share, then "Add to Home Screen".
6. Open the installed icon once while online; after the app has loaded and cached, it can be used offline.

IMPORTANT
- Service workers and installable home-screen apps require a secure context (normally HTTPS; localhost is also allowed). Opening index.html directly as file:// from a ZIP/extracted folder will display the calculator in many browsers, but will NOT enable reliable offline caching or PWA installation.
- This is a planning aid, not an approved flight-planning or dispatch tool. Verify all figures and operational decisions against approved aircraft documents and procedures.
