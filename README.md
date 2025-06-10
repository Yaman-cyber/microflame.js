# 🔥 MicroFlame.js – Express MVC CLI Generator

[![npm version](https://img.shields.io/npm/v/microflame)](https://www.npmjs.com/package/microflame)
[![downloads](https://img.shields.io/npm/dt/microflame)](https://www.npmjs.com/package/microflame)
[![license](https://img.shields.io/npm/l/microflame)](LICENSE)

> **MicroFlame** is a command-line tool (CLI) for generating full-featured **Node.js Express MVC applications** with views, models, routes, and environment setup — all in seconds.

It scaffolds boilerplate code for Express + Mongoose projects using best practices, including folder structure, routing, environment management, and logging. Perfect for quickly starting REST APIs or web apps with a view engine.

![MicroFlame Logo](./assets/logo.png)

---

## ✨ Features

- 📦 Uses Express, Mongoose, and Winston with zero wrapping
- 🏗️ Scaffold models, views, controllers, and routes easily
- 🚀 Initialize a fully structured project in seconds
- ⚙️ Add environment variables across all environments with one command

---

## 🤔 Why MicroFlame?

Most Node.js boilerplate tools either add too much overhead or are not flexible enough. MicroFlame gives you:

- A clean Express + Mongoose setup
- CLI scaffolding for MVC architecture
- Views, routes, models, and environment config
- A fast way to prototype or build production-ready apps

---

## 🚀 Getting Started

### 1. Install MicroFlame CLI globally

```bash
npm install -g microflame
```

---

### 2. Initialize a New Project

```bash
microflame init my-app
```

This will:

- Create a new directory `my-app`
- Copy the base project boilerplate
- Print instructions for running the development server

**Next Steps:**

```bash
cd my-app
npm install
# Fill in your environment variables in .env.development
npm run dev
```

---

## 🛠️ CLI Commands

### 📦 `init`

Create a new MicroFlame project:

```bash
microflame init <directory>
```

This command initializes a new project in the specified directory.

**Example:**

```bash
microflame init my-new-app
```

---

### ⚙️ `generate` (alias: `g`)

Scaffold components for your app:

#### Controller

```bash
microflame generate controller user --mode api
```

This generates a new controller for the `user` resource, with an API mode.

**Example:**

```bash
microflame generate controller user --mode views
```

#### Model

```bash
microflame generate model user
```

This generates a model for the `user` resource.

**Example:**

```bash
microflame generate model post
```

#### View

```bash
microflame generate view home
```

This generates a view template for the `home` page.

**Example:**

```bash
microflame generate view about
```

#### Route

```bash
microflame generate route user
```

This generates a route for the `user` resource.

**Example:**

```bash
microflame generate route post
```

---

### 🔐 `add-env`

Add a new environment variable to `.env.development`, `.env.production`, and the config system:

**Example:**

```bash
microflame add-env TEMPLATE_JWTPRIVATEKEY mySecretKey true
```

This adds a new environment variable called `TEMPLATE_JWTPRIVATEKEY` with the value `mySecretKey` and marks it as required (`true`).

## 📁 Project Code Structure

A detailed explanation of the project architecture, folder structure, and best practices.

➡️ [Code Structure Guide](./docs/code-structure.md)

---

## ❤️ Contributing

If you'd like to contribute to MicroFlame, feel free to submit a pull request or open an issue.

---

## 📃 License

MIT License

---

## 🧯 Author

Built with care by Yaman Arab(Github: Yaman-cyber) 🛠️
