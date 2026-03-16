// @ts-nocheck
"use client";

import { useEffect } from "react";

// Import server runtime (runs automatically on server)
import "../core/server/serverRuntime";

// Import client initializer
import { initClientRuntime } from "../core/client/clientRuntime";

let started = false;

export function GSReporter() {
  useEffect(() => {
    // Prevent double init during Fast Refresh
    if (started) return;
    started = true;

    // Start browser monitoring
    initClientRuntime();
  }, []);

  return null;
}
