import { handleServerError, patchServerConsole } from "./serverRuntime";

const g = globalThis as any;

if (!g.__GS_ERROR_REPORTER_SERVER__) {
  g.__GS_ERROR_REPORTER_SERVER__ = true;

  console.log("gs-error-reporter: server monitoring initialized");

  // Attach process listeners
  process.on("uncaughtException", (error) => {
    handleServerError(error, "uncaughtException");
  });

  process.on("unhandledRejection", (reason: any) => {
    handleServerError(reason, "unhandledRejection");
  });

  // Patch console (optional but powerful)
  patchServerConsole();
}
