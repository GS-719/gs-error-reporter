import fs from 'fs';
import path from "path";

const root = process.cwd();

export function copyTemplateFile(
  templatePath: string,
  targetPath: string
) {
  // If file already exists → DO NOTHING
  if (fs.existsSync(targetPath)) {
    console.log(`⚠ Skipped (already exists): ${targetPath}`);
    return;
  }

  // Ensure directory exists
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });

  // Copy file
  fs.copyFileSync(templatePath, targetPath);

  console.log(`✔ Created: ${targetPath}`);
}

