# Payment Form with Yup — Day 9

Responsive React payment form built with Formik and Yup.

## Features
- Cardholder name validation
- Card number validation with Luhn checksum
- Expiry `MM/YY` format and expiration validation
- CVV (3–4 digits)
- Billing name, address, city, state, Indian 6-digit PIN code, and email validation
- Inline field errors, INR order summary, responsive layout, success state

## Run
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local URL Vite displays.

## Safety
Learning demo only. It does not process payments, send form data, or store card details. Do not enter real card information. Production checkout should use a trusted payment provider's hosted/tokenized components and server-side validation; client-side Yup is not payment security.

## Files
- `src/App.jsx` — Formik form and Yup schema
- `src/styles.css` — responsive styling
- `src/main.jsx` — React entry point
