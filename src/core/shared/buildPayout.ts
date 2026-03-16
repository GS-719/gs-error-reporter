// @ts-nocheck
/* 
  buildPayload.ts
  Converts raw error data into a structured report
*/

type RuntimeType = "client" | "server";

interface BuildPayloadOptions {
  runtime: RuntimeType;
  error: any;
  extra?: Record<string, any>;
}

export interface ErrorPayload {
  type: RuntimeType;
  message: string;
  stack?: string;
  timestamp: string;

  url?: string;
  method?: string;

  userAgent?: string;
  language?: string;

  nodeVersion?: string;
  platform?: string;

  environment?: string;

  extra?: Record<string, any>;
}

/* -------------------------------------------------- */
/*                Utility: normalize error             */
/* -------------------------------------------------- */

function normalizeError(error: any) {
  if (!error) {
    return {
      message: "Unknown error",
      stack: undefined,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  // Sometimes promises reject with string/object
  if (typeof error === "string") {
    return {
      message: error,
      stack: undefined,
    };
  }

  // fallback
  return {
    message: JSON.stringify(error),
    stack: undefined,
  };
}

/* -------------------------------------------------- */
/*                Main Payload Builder                */
/* -------------------------------------------------- */

export function buildPayload(options: BuildPayloadOptions): ErrorPayload {
  const { runtime, error, extra } = options;

  const normalized = normalizeError(error);

  const basePayload: ErrorPayload = {
    type: runtime,
    message: normalized.message,
    stack: normalized.stack,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    extra,
  };

  /* ---------------- CLIENT DATA ---------------- */

  if (runtime === "client" && typeof window !== "undefined") {
    basePayload.url = window.location.href;
    basePayload.userAgent = navigator.userAgent;
    basePayload.language = navigator.language;
  }

  /* ---------------- SERVER DATA ---------------- */

  if (runtime === "server" && typeof process !== "undefined") {
    basePayload.nodeVersion = process.version;
    basePayload.platform = process.platform;
  }

  return basePayload;
}
