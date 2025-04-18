#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get command line args
const [key, value, label, requiredFlag] = process.argv.slice(2);

if (!key || !value || !label) {
  console.error(
    "Usage: node scripts/add-env-var.js <key> <value> <label> [required:true|false]"
  );
  process.exit(1);
}

const required = requiredFlag === "true";

const configFolder = path.join(process.cwd(), "config");
const envJsonPath = path.join(
  configFolder,
  "custom-environment-variables.json"
);
const testJsonPath = path.join(configFolder, "test.json");
const configCheckPath = path.join(process.cwd(), "start", "config.js");

// Step 1: Update custom-environment-variables.json
let envVars = {};
if (fs.existsSync(envJsonPath)) {
  envVars = JSON.parse(fs.readFileSync(envJsonPath, "utf-8"));
}

envVars[label] = key;
fs.writeFileSync(envJsonPath, JSON.stringify(envVars, null, 2));
fs.writeFileSync(testJsonPath, JSON.stringify(envVars, null, 2));

// Step 2: Update only .env* files in the root directory
const rootFiles = fs.readdirSync(process.cwd());

for (const file of rootFiles) {
  const fullPath = path.join(process.cwd(), file);

  if (fs.statSync(fullPath).isFile() && file.startsWith(".env")) {
    let lines = fs.readFileSync(fullPath, "utf-8").split("\n");

    let updated = false;
    lines = lines.map((line) => {
      if (line.trim().startsWith(`${key}=`)) {
        updated = true;
        return `${key}=${value}`;
      }
      return line;
    });

    if (!updated) {
      lines.push(`${key}=${value}`);
    }

    fs.writeFileSync(fullPath, lines.join("\n"), "utf-8");
  }
}

// Step 3: If required, update start/config.js
if (required) {
  if (!fs.existsSync(configCheckPath)) {
    console.error("❌ 'start/config.js' not found.");
    process.exit(1);
  }

  const configContent = fs.readFileSync(configCheckPath, "utf-8");

  const checkLine = `\n if (!config.get("${label}")) {\n    throw new Error("FATAL ERROR:${label} is not defined");\n  }`;

  // Only add if not already present
  if (!configContent.includes(`config.get("${label}")`)) {
    const lines = configContent.split("\n");
    const insertIndex = lines.findIndex((line) => line.trim() === "};");

    if (insertIndex !== -1) {
      lines.splice(insertIndex, 0, checkLine);
      fs.writeFileSync(configCheckPath, lines.join("\n"), "utf-8");
    }
  }
}

console.log(`✅ Environment variable added:
- Label: ${label}
- Key: ${key}
- Value: ${value}
- Required in config: ${required}`);
