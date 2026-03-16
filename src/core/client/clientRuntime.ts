// @ts-nocheck
/*
  Browser Runtime Monitor
  NOTE: Do NOT auto-run this file.
  It must be started from a client React component.
*/

import { reportError } from "../shared/reporter";
import { buildPayload } from "../shared/buildPayout";

let initialized = false;
let reporting = false;

async function safeReport(type: string, error: any, extra?: Record<string, any>) {
  if (reporting) return;
  reporting = true;

  try {
    // Build structured payload
    const payload = buildPayload({
      runtime: "client",
      error,
      extra: {
        errorType: type,
        ...extra,
      },
    });

    await reportError(payload);
    console.log("ERROR CATCHED!");
  } catch (err) {
    // never break app
    console.log("gs-error-reporter failed to send error report", err);
  }

  reporting = false;
}

/* ---------------- Runtime JS errors ---------------- */

function attachRuntimeErrorListener() {
  window.addEventListener("error", (event) => {
    safeReport("window.error", event.error || event.message, {
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

/* ---------------- Promise rejections ---------------- */

function attachUnhandledRejection() {
  window.addEventListener("unhandledrejection", (event) => {
    safeReport("unhandledrejection", event.reason);
  });
}

/* ---------------- Console patch ---------------- */

function patchConsole() {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    originalError(...args);
    safeReport("console.error", args, { source: "client-console" });
  };

  console.warn = (...args: any[]) => {
    originalWarn(...args);
    safeReport("console.warn", args, { source: "client-console" });
  };
}

/* ---------------- Public initializer ---------------- */

export function initClientRuntime() {
  if (initialized) return;
  initialized = true;

  attachRuntimeErrorListener();
  attachUnhandledRejection();
  patchConsole();

  console.log("gs-error-reporter client runtime initialized");
}
