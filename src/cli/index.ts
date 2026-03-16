#!/usr/bin/env node
import path from "path";
import fs from 'fs';

import inquirer from 'inquirer';
import chalk from 'chalk';

import { hasTsconfig } from "./detectProject";
import { baseDir } from "./detectProject";
import { hasAppRouter } from "./detectProject";
import { hasPagesRouter } from "./detectProject";

import { copyTemplateFile } from "./fileInstaller";
import { setupEnv } from "./installEnv";

console.log(chalk.cyanBright(`\n!!! Welcome to gs-error-reporter !!!`));
console.log(chalk.white(`gs-error-reporter is an error reporting system for Next.js (App Router & Pages Router) with email notifications and CLI setup. (1.0.0)`));
console.log(chalk.yellowBright(`\nThis is the CLI system that will generate important files for gs-error-reporter.`));
console.log(chalk.redBright(`\nIMPORTANT INFORMATION:`));
console.log(`  * Provide all requested information carefully.`);
console.log(`  * Version 1.0.0 supports Gmail only.\n`);


const rootPath = process.cwd();


const packageJsonPath = path.join(rootPath, "package.json");

if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ No package.json found. Run this inside a Next.js project.");
  process.exit(1);
}

const packageJson = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf8")
);

if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
  console.error("❌ This is not a Next.js project.");
  process.exit(1);
}


setupEnv(rootPath);


async function setup() {

    const templatesDir = path.join(__dirname, "../../templates", hasTsconfig ? "ts" : "js");

    const instrumentationTarget = path.join(
        rootPath,
        baseDir,
        "instrumentation." + (hasTsconfig ? "ts" : "js")
    );

    copyTemplateFile(
        path.join(templatesDir, "instrumentation." + (hasTsconfig ? "ts" : "js")),
        instrumentationTarget
    );

    const AppRouter = hasAppRouter(rootPath);
    const PagesRouter = hasPagesRouter(rootPath);

    if (AppRouter && PagesRouter) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'router',
                message: 'In What router you want to inmplement SendMail API',
                choices: ['App Router', 'Pages Router']
            }
        ]);
    } else if (AppRouter && !PagesRouter) {
        const SendMailTarget = path.join(
            rootPath,
            baseDir,
            "app",
            "api",
            "gs-error-reporter",
            "route." + (hasTsconfig ? "ts" : "js")
        );

        copyTemplateFile(
            path.join(templatesDir, "route." + (hasTsconfig ? "ts" : "js")),
            SendMailTarget
        );
    } else if (!AppRouter && PagesRouter) {
        const SendMailTarget = path.join(
            rootPath,
            baseDir,
            "pages",
            "api",
            "gs-error-reporter." + (hasTsconfig ? "ts" : "js")
        );

        copyTemplateFile(
            path.join(templatesDir, "gs-error-reporter." + (hasTsconfig ? "ts" : "js")),
            SendMailTarget
        );
    }

}

setup();