#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const modelNameRaw = process.argv[2]; // e.g., user, blog/Post

if (!modelNameRaw) {
  console.error("Usage: node scripts/create-model.js <ModelName or Nested/Path/ModelName>");
  process.exit(1);
}

// Parse name and folder
const parts = modelNameRaw.split("/");
const rawModelName = parts.pop().replace(/(\.model)?(\.js)?$/, "");
const nestedPath = parts.join("/");

const folderPath = path.join(process.cwd(), "models", nestedPath);
const filePath = path.join(folderPath, `${rawModelName}.model.js`);

// Capitalize first letter for schema/model name
const modelName = rawModelName.charAt(0).toUpperCase() + rawModelName.slice(1);

// Model template
const modelTemplate = (name) => `const mongoose = require("mongoose");

const ${name.toLowerCase()}Schema = new mongoose.Schema({
  // Define your schema fields here
},
  { timestamps: true }
);


const ${name} = mongoose.model("${name}", ${name.toLowerCase()}Schema)

exports.${name} = ${name};
`;

// Create folder if needed
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Stop if model already exists
if (fs.existsSync(filePath)) {
  console.error("❌ Model already exists.");
  process.exit(1);
}

// Write the model file
fs.writeFileSync(filePath, modelTemplate(modelName));
console.log(`✅ Model '${modelName}' created at '${filePath}'`);
