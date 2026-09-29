# Aura — Period Tracker

Offline-first period & fertility tracker. Vanilla JS, no build step.

## Run

Just open `index.html` in a browser. Or serve locally:

    python3 -m http.server

## Structure

- `js/utils.js`  — date + string helpers
- `js/i18n.js`   — Burmese / English strings
- `js/store.js`  — state and localStorage
- `js/cycle.js`  — cycle math (period, fertile, ovulation)
- `js/ui.js`     — DOM rendering
- `js/main.js`   — event wiring

## Notes

- All dates are local-time. `new Date("YYYY-MM-DD")` is NOT used because it parses as UTC.
- Logs are saved in `localStorage` under `aura_logs` and settings under `aura_data`.
- If you're extending this, remember to bump `state.version` when the log shape changes.