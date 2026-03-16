import fs from "fs";
import path from "path";

const root = process.cwd();

// Check for TypeScript
export const hasTsconfig = fs.existsSync(path.join(root, "tsconfig.json"));
console.log("Typescript: ", hasTsconfig);

// Check for "src" directory
export const hasSrc = fs.existsSync(path.join(root, "src"));
export const baseDir = hasSrc ? "src" : "";

// Check for App Router
export function hasAppRouter(rootPath: string) {
  const base = fs.existsSync(path.join(rootPath, "src")) ? "src" : "";
  const appPath = path.join(rootPath, base, "app");

  return (
    fs.existsSync(appPath) &&
    (
      fs.existsSync(path.join(appPath, "layout.tsx")) ||
      fs.existsSync(path.join(appPath, "layout.jsx")) ||
      fs.existsSync(path.join(appPath, "layout.js")) ||
      fs.existsSync(path.join(appPath, "layout.ts"))
    )
  );
}

// Check for Pages Router
export function hasPagesRouter(rootPath: string) {
  const base = fs.existsSync(path.join(rootPath, "src")) ? "src" : "";
  const pagesPath = path.join(rootPath, base, "pages");

  return (
    fs.existsSync(path.join(pagesPath, "_app.tsx")) ||
    fs.existsSync(path.join(pagesPath, "_app.jsx")) ||
    fs.existsSync(path.join(pagesPath, "_app.js")) ||
    fs.existsSync(path.join(pagesPath, "_app.ts"))
  );
}