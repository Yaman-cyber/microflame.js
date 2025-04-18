#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const type = process.argv[2]; // 'api' or 'views'
const rawName = process.argv[3]; // e.g., 'v1/admin/user.js'

if (!type || !rawName) {
  console.error("Usage: node scripts/create-route.js <api|views> <Nested/Path/RouteName>");
  process.exit(1);
}

const parts = rawName.split("/");
let routeName = parts.pop().replace(/(\.routes)?(\.js)?$/, "");
const nestedParts = parts;
const nestedPath = parts.join("/");

const baseRouteDir = path.join(process.cwd(), "routes", type.toLowerCase());
const folderPath = path.join(baseRouteDir, nestedPath);
const filePath = path.join(folderPath, `${routeName}.routes.js`);

const fullPathFromRoutes = path.join("routes", type.toLowerCase(), nestedPath);
const depth = fullPathFromRoutes.split(path.sep).length;
const relativePrefix = Array(depth).fill("..").join("/");

const controllerRelativePath = `${relativePrefix}/controllers/${type}/${nestedPath ? nestedPath + "/" : ""}${routeName}.controller`;
const controllerAbsolutePath = path.join(process.cwd(), "controllers", type, nestedPath, `${routeName}.controller.js`);

const routeTemplate = (name, type, controllerExists) => {
  const routePath = `/${name}`;
  const importLine = controllerExists ? `const controller = require("${controllerRelativePath}");\n` : "";
  const handler = controllerExists
    ? type === "api"
      ? `router.get("/", controller.get);\nrouter.post("/", controller.post);`
      : `router.get("/", controller.index);`
    : `// TODO: Add route handlers here`;

  return `const express = require("express");
const router = express.Router();
${importLine}\n${handler}

module.exports = router;
`;
};

const indexTemplate = `const fs = require("fs");
const express = require("express");
const router = express.Router();

fs.readdirSync(__dirname).forEach((file) => {
  if (file.indexOf("index") === -1 && file.endsWith(".js")) {
    const routeName = file.split(".")[0];
    router.use(\`/\${routeName === "home" ? "" : routeName}\`, require(\`./\${file}\`));
  }
});

module.exports = router;
`;

// Recursively ensure each nested folder has an index.js
let currentPath = baseRouteDir;
for (let i = 0; i < nestedParts.length; i++) {
  currentPath = path.join(currentPath, nestedParts[i]);

  if (!fs.existsSync(currentPath)) {
    fs.mkdirSync(currentPath, { recursive: true });
    console.log(`📁 Created directory: ${currentPath}`);
  }

  const indexPath = path.join(currentPath, "index.js");
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexTemplate);
    console.log(`🧩 Created index.js in: ${currentPath}`);
  }
}

// Avoid overwriting existing route file
if (fs.existsSync(filePath)) {
  console.error("❌ Route already exists.");
  process.exit(1);
}

const controllerExists = fs.existsSync(controllerAbsolutePath);

// Write the new route file
fs.writeFileSync(filePath, routeTemplate(routeName, type, controllerExists));
console.log(`✅ ${type.toUpperCase()} route '${routeName}' created at '${filePath}'`);
