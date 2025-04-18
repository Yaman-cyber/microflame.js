#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const targetDir = process.argv[2];

if (!targetDir) {
  console.error("❌ Please specify a directory: microflame init <directory>");
  process.exit(1);
}

const templateDir = path.join(__dirname, "../templates");
const newProjectPath = path.resolve(process.cwd(), targetDir);

// Recursive copy
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log(`📁 Creating project in: ${newProjectPath}`);
copyDir(templateDir, newProjectPath);
console.log("✅ Template files copied.");

// Run npm install commands
try {
  console.log("📦 Installing dependencies...");
  execSync("npm i", { cwd: newProjectPath, stdio: "inherit" });

  console.log("🎉 Project setup complete.");
} catch (err) {
  console.error("❌ Failed during npm install:", err.message);
}
