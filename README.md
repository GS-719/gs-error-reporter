# GS Error Reporter

A lightweight error monitoring tool for **Next.js** that captures **client-side and server-side errors** and sends detailed email reports.

It supports both **App Router** and **Pages Router**, and can be quickly installed using a simple CLI setup.

---

## Features

- Capture **client-side runtime errors**
- Capture **server-side runtime errors**
- Capture **unhandled promise rejections**
- Capture **console errors and warnings**
- Works with **Next.js App Router and Pages Router**
- Simple **CLI setup**
- Sends **structured email reports**

---

## Installation

Install the package:

```bash
npm install gs-error-reporter
npx gs-error-reporter
```

---

## Setup

After running the CLI, the following files will be created automatically:

- `instrumentation.ts`
- `app/api/gs-error-reporter/route.ts` (App Router)
-  or `pages/api/gs-error-reporter.ts` (Pages Router)
- `.env` variables (if missing)

The CLI will detect your project configuration automatically.

---

### App Router

Add the reporter to your `layout.tsx`:

```tsx
import { GSReporter } from "gs-error-reporter";

<GSReporter />
```

### Pages Router

Add the reporter inside `_app.tsx`:

```tsx
import { GSReporter } from "gs-error-reporter";

<GSReporter />
```

---

## Environment Variables

Add the following variables to your `.env` file:

```
GS_REPORTER_EMAIL=Sender_Email
GS_REPORTER_APP_PASSWORD=Sender's_Gmail_App_Password
GS_REPORTER_RECEIVER=Receiver_Email
BASE_URL=Domain
PROJECT_NAME=my-next-app
```

**Note: Gmail app password is required**

---

## Example Email Report

The reporter sends detailed error reports including:

- Error message
- Stack trace
- Runtime type (client/server)
- URL
- User agent
- Timestamp

---

## Supported Environments

- Next.js 13+
- App Router
- Pages Router
- Node runtime

---

## License

MIT License
