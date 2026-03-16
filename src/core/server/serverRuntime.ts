// @ts-nocheck
/*
   Server Error Handler (NOT a runtime starter anymore)
   This file only processes errors sent by server/index.ts
*/

import { reportError } from "../shared/reporter";
import { buildPayload } from "../shared/buildPayout";

/* ---------------------------------------------------------- */
/*                INTERNAL PROTECTION (ANTI-LOOP)              */
/* ---------------------------------------------------------- */

let reporting = false;

/* ---------------------------------------------------------- */
/*                 MAIN SERVER ERROR HANDLER                   */
/* ---------------------------------------------------------- */

export async function handleServerError(error: any, source: string) {
  // Prevent recursive reporting
  if (reporting) return;
  reporting = true;

  try {
    const payload = buildPayload({
      runtime: "server",
      error,
      extra: {
        errorType: source,
      },
    });

    await reportError(payload);

    console.log("gs-error-reporter captured server error:", source);
  } catch (err) {
    // Never allow reporter itself to crash the server
    console.warn("gs-error-reporter failed while reporting server error");
  }

  reporting = false;
}

/* ---------------------------------------------------------- */
/*            OPTIONAL: SERVER CONSOLE MONITORING              */
/* ---------------------------------------------------------- */

let consolePatched = false;

export function patchServerConsole() {
  if (consolePatched) return;
  consolePatched = true;

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    originalError(...args);
    handleServerError(args, "console.error");
  };

  console.warn = (...args: any[]) => {
    originalWarn(...args);
    handleServerError(args, "console.warn");
  };

  console.log("gs-error-reporter server console patched");
}
