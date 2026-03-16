import fs from "fs";
import path from "path";

const REQUIRED_ENV_VARS: Record<string, string> = {
    GS_REPORTER_EMAIL: "",
    GS_REPORTER_APP_PASSWORD: "",
    GS_REPORTER_RECEIVER: "",
    BASE_URL: "",
    PROJECT_NAME: ""
};

export function setupEnv(projectRoot: string) {
    const envPath = path.join(projectRoot, ".env");

    // ------------------------------------
    // CASE 1: .env does not exist
    // ------------------------------------
    if (!fs.existsSync(envPath)) {
        const content = Object.entries(REQUIRED_ENV_VARS)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n");

        fs.writeFileSync(envPath, content + "\n");

        console.log("✔ Created .env with gs-error-reporter variables");
        return;
    }

    // ------------------------------------
    // CASE 2: .env exists → append safely
    // ------------------------------------
    const existingContent = fs.readFileSync(envPath, "utf8");

    const linesToAppend: string[] = [];

    for (const key of Object.keys(REQUIRED_ENV_VARS)) {
        const regex = new RegExp(`^${key}=`, "m");

        if (!regex.test(existingContent)) {
            linesToAppend.push(`${key}=`);
        }
    }

    if (linesToAppend.length === 0) {
        console.log("✔ .env already contains required variables");
        return;
    }

    fs.appendFileSync(envPath, "\n# GS Error Reporter\n" + linesToAppend.join("\n") + "\n");

    console.log("✔ Added missing gs-error-reporter variables to .env");
}
