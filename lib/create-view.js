#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const rawName = process.argv[2]; // e.g., 'auth/login'

if (!rawName) {
  console.error("Usage: node scripts/create-view.js <Nested/Path/ViewName>");
  process.exit(1);
}

const parts = rawName.split("/");
let viewName = parts.pop().replace(/\.ejs$/, "");
const nestedPath = parts.join("/");

const folderPath = path.join(process.cwd(), "views", nestedPath);
const filePath = path.join(folderPath, `${viewName}.ejs`);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error("❌ View already exists.");
  process.exit(1);
}

const viewTemplate = `<%- include('../partials/header') %>

<div class="container">
  <h1><%= title || "${viewName}" %></h1>
  <p>This is the <strong>${viewName}</strong> view.</p>
</div>

<%- include('../partials/footer') %>
`;

fs.writeFileSync(filePath, viewTemplate);
console.log(`✅ View '${viewName}' created at '${filePath}'`);
