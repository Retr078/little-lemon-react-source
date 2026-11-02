# Little Lemon — React Table Reservations

A responsive React application created for the Little Lemon front-end capstone assignment. Olive green, lemon yellow, editorial typography, and restaurant imagery support a clear two-step reservation experience.

- **Live preview:** https://little-lemon-react-source.netlify.app/
- **Design file:** [Little Lemon Design.html](https://github.com/Retr078/little-lemon-react-source/blob/main/Little%20Lemon%20Design.html) — click **Download raw file** on that page and open it in a browser to view the design mockups.
- **Source code:** https://github.com/Retr078/little-lemon-react-source
- **Test results:** run `npm test` locally (see below); all unit and React integration tests are in `src/booking.test.jsx`.

## Reviewer feedback addressed

- **Live, viewable site:** the app is deployed on Netlify (link above), so it can be reviewed without installing anything.
- **Design file included:** the Little Lemon design mockup is committed to the repository (link above) so the implemented UI can be compared against the design.
- **Parent component owns available times:** `BookingPage` holds `availableTimes` with `useReducer(updateTimes, undefined, initializeTimes)` and passes `availableTimes` and `dispatch` to `BookingForm` as props.
- **`initializeTimes` / `updateTimes`:** defined in `src/booking.js`. Changing the date in the form dispatches `{ date }`, and `updateTimes` returns that day's free seatings (past times and booked slots removed).
- **Unit tests for the new functions:** `initializeTimes` returns today's available times; `updateTimes` removes a booked slot for the chosen date and keeps it for other dates. A component test checks that `BookingForm` renders times from props and dispatches the selected date.
- **Social sharing metadata:** `index.html` includes Open Graph and Twitter card tags (title, description, image and alt text).

## Run locally

Requires Node.js 20.19+ (Node 22 or 24 recommended) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm test
npm run build
```

The production static application is generated in `dist/`.

## Features

- Select a date, party size, seating time, occasion, and seating preference.
- Enter guest details, optional dietary/accessibility requests, and confirm.
- View and cancel saved reservations using **My reservations**.
- Reserve up to 90 days ahead, for 1–8 guests, from 5–9 PM Chicago time.
- Past seatings and already-booked slots are removed. Duplicate submissions are checked again at save time.
- Local storage errors, malformed saved data, validation failures, and empty availability have explanatory messages.

## Scope and data

This is an educational demo. Reservations are stored in this browser's localStorage, not transmitted to a restaurant. No confirmation email or payment is sent. Availability is simulated: each time slot accepts one reservation per browser. Different browsers do not share availability. Patio seating is a preference subject to weather. Real deployment would require a server, shared inventory, atomic booking transactions, authentication, notification services, and restaurant-approved policies. Simultaneous writes from different tabs are not transactional.

## Structure

- `src/main.jsx`: semantic page, `BookingPage` (parent that owns available times via `useReducer`), `BookingForm` (receives `availableTimes` and `dispatch` as props), confirmation and reservation management dialog.
- `src/booking.js`: `initializeTimes`/`updateTimes` reducer functions, validation, Chicago date/time handling, availability and storage operations.
- `src/styles.css`: responsive layouts, focus indicators, reduced motion and branded styling.
- `src/booking.test.jsx`: validation, persistence, collision and React interaction tests.

## Accessibility

Semantic header, navigation, main, sections and footer; skip link; explicit form labels; grouped time choices; pressed state for selected time; programmatic errors; focus moved to the first invalid field and step headings; keyboard-operable native dialog; visible focus rings; responsive design; reduced-motion support. Optional fields are identified. Verify keyboard interaction and screen reader behavior on your target browser before submitting.

## Assignment review checklist

- UI and responsiveness: desktop split layout and single-column mobile layout.
- Functional validation: date window, times, party size, contact details, acknowledgment and duplicates.
- Tests: `npm test` runs unit and React integration tests with Vitest and Testing Library.
- Git: source is committed to the public [GitHub repository](https://github.com/Retr078/little-lemon-react-source).
- Maintainability: isolated booking logic and shared validation for both steps.
- Documentation: setup, commands, architecture, limitations, live preview, design file and credits here.

## Credits

React, Vite, Vitest, Testing Library, Lucide icons. Fonts: DM Sans and Playfair Display via Google Fonts. Restaurant and food photography via Unsplash. Restaurant details, menu prices and reservation availability are illustrative coursework content.
