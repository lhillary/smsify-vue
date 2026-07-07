# Smsify

Smsify is a web app for running SMS campaigns. You create a campaign, add contacts, pick a phone number, and send a bulk text message to everyone on the list. When people reply, their responses are collected, sorted into categories you define (e.g. "Yes" / "No"), and shown in a response log and results view.

Messages are sent through [Twilio](https://www.twilio.com/) — but through *your* Twilio account, not ours. From the Settings page you connect your Twilio account via Twilio Connect, and Smsify then purchases phone numbers and sends messages on your behalf.

This repo is the frontend only. It talks to a separate Smsify REST API for accounts, campaigns, contacts, numbers, and messaging.

## What you can do

- **Register / log in** to a Smsify account
- **Connect your Twilio account** (and disconnect it) from Settings
- **Search and purchase phone numbers** to send from
- **Create campaigns** with a name, description, and sending number
- **Manage contacts** per campaign (add, edit, delete)
- **Define response categories** for how replies should be classified
- **Send bulk SMS** to all contacts in a campaign
- **Review replies** in a response log, with categorized results

## Tech stack

- [Vue 3](https://vuejs.org/) with TypeScript, built with Vue CLI
- [Pinia](https://pinia.vuejs.org/) for state, [Vue Router](https://router.vuejs.org/) for routing
- [PrimeVue](https://primevue.org/) + PrimeFlex for UI components and styling
- [axios](https://axios-http.com/) with an API client generated from the backend's OpenAPI spec (`src/api-client/`)

## Getting started

1. Install dependencies:

   ```
   npm install
   ```

2. Point the app at the Smsify API by creating a `.env` file in the project root:

   ```
   VUE_APP_API_URL=<base URL of the Smsify API>
   ```

3. Run the dev server (with hot reload):

   ```
   npm run serve
   ```

Other scripts:

```
npm run build   # production build to dist/
npm run lint    # lint and auto-fix
```

## Project layout

```
src/
├── api-client/   # generated OpenAPI client for the Smsify API
├── components/   # shared components (loader, modals, etc.)
├── stores/       # Pinia stores (user, campaigns, phone numbers, contacts, categories, sms)
├── router/       # routes and auth guard
├── utils/        # http config, interceptors, toasts, phone number helpers
└── views/        # pages (dashboard, campaigns, phone numbers, settings, auth, Twilio callback)
```
