#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const type = process.argv[2]; // 'api' or 'views'
const rawName = process.argv[3]; // e.g., 'v1/admin/user.controller.js'

if (!type || !rawName) {
  console.error("Usage: node scripts/create-controller.js <api|views> <Nested/Path/ControllerName>");
  process.exit(1);
}

// Parse path parts
const parts = rawName.split("/");
let controllerName = parts.pop().replace(/(\.controller)?(\.js)?$/, "");
const nestedPath = parts.join("/");

const controllerFolder = path.join(process.cwd(), "controllers", type.toLowerCase(), nestedPath);
const controllerFile = path.join(controllerFolder, `${controllerName}.controller.js`);

const fullPathFromControllers = path.join("controllers", type.toLowerCase(), nestedPath);
const depth = fullPathFromControllers.split(path.sep).length;
const relativePrefix = Array(depth).fill("..").join("/"); // For API pathing
const constantsPath = `${relativePrefix}/constants`;

const controllerTemplate = {
  api: (name) => `
// ${name} - API Controller
const messages = require("${constantsPath}/messages.json");
const responseCodes = require("${constantsPath}/responseCodes.json");

exports.get = (req, res, next) => {
  res.code = responseCodes.success;
  res.message = "${name} GET endpoint";
  return next();
};

exports.post = (req, res, next) => {
  res.code = responseCodes.success;
  res.data = req.body;
  res.message = "${name} POST endpoint";
  return next();
};
`,
  views: (name) => `
// ${name} - View Controller

exports.index = (req, res) => {
  res.render("${name.toLowerCase()}", {
    title: "${name} Page",
  });
};
`,
};

const viewTemplate = (name) => `<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>${name} View</h1>
  <p>This is the <strong>${name}</strong> view.</p>
</body>
</html>
`;

// Create controller folder
if (!fs.existsSync(controllerFolder)) {
  fs.mkdirSync(controllerFolder, { recursive: true });
}

if (fs.existsSync(controllerFile)) {
  console.error("❌ Controller already exists.");
  process.exit(1);
}

// Write controller file
fs.writeFileSync(controllerFile, controllerTemplate[type](controllerName));
console.log(`✅ ${type.toUpperCase()} controller '${controllerName}' created at '${controllerFile}'`);

// Create basic view if it's a view controller
if (type === "views") {
  const viewFolder = path.join(process.cwd(), "views");
  const viewFile = path.join(viewFolder, `${controllerName.toLowerCase()}.ejs`);

  if (!fs.existsSync(viewFolder)) {
    fs.mkdirSync(viewFolder, { recursive: true });
  }

  if (!fs.existsSync(viewFile)) {
    fs.writeFileSync(viewFile, viewTemplate(controllerName));
    console.log(`✅ View file created at '${viewFile}'`);
  } else {
    console.log(`⚠️ View file already exists at '${viewFile}'`);
  }
}
