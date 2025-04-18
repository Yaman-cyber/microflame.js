#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const figlet = require("figlet");
const chalk = require("chalk");
const { Command } = require("commander");

const program = new Command();
program
  .name("microflame")
  .description("MicroFlame CLI - scaffold your Node.js app fast")
  .version("1.0.0");

const scriptsPath = path.join(__dirname, "..", "lib");

program
  .command("generate <type> <name>")
  .alias("g")
  .description("Generate a new component (model, view, controller, route)")
  .option("--mode <mode>", "api or views (for controller)", "api")
  .action((type, name, options) => {
    let scriptFile = "";
    const args = [];

    switch (type) {
      case "controller":
        scriptFile = path.join(scriptsPath, "create-controller.js");
        args.push(options.mode, name);
        break;
      case "model":
        scriptFile = path.join(scriptsPath, "create-model.js");
        args.push(name);
        break;
      case "view":
        scriptFile = path.join(scriptsPath, "create-view.js");
        args.push(name);
        break;
      case "route":
        scriptFile = path.join(scriptsPath, "create-route.js");
        args.push(name);
        break;
      default:
        console.log(`❌ Unknown type: ${type}`);
        return;
    }

    const child = spawn("node", [scriptFile, ...args], {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`❌ Script exited with code ${code}`);
      }
    });
  });

// 👇 Add this block to support: microflame init <directory>
program
  .command("init <directory>")
  .description("Initialize a new MicroFlame project in the specified directory")
  .action((directory) => {
    const scriptFile = path.join(scriptsPath, "copy-templates.js");
    const child = spawn("node", [scriptFile, directory], {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`❌ Failed to initialize project.`);
        return;
      }

      // Show flame logo
      console.log(
        chalk.greenBright(
          figlet.textSync(`🔥 MicroFlame.js`, {
            font: "Fire Font-s",
            horizontalLayout: "default",
            verticalLayout: "default",
          })
        )
      );
      // Show next steps
      console.log(chalk.cyan(`\n✅ Project initialized in ${directory}`));
      console.log(chalk.yellow(`\nNext steps:`));
      console.log(chalk.white(`  👉 cd ${directory}`));
      console.log(chalk.white(`  🛠  Fill in your .env.development file`));
      console.log(chalk.white(`  🚀 Run the dev server:`));
      console.log(chalk.green(`  npm run dev\n`));
    });
  });

// 👇 Add this block to support: creation of environment variables
program
  .command("add-env <key> <value> <label> [required]")
  .description("Add an environment variable to all .env files and config")
  .action((key, value, label, required = "false") => {
    const scriptFile = path.join(scriptsPath, "create-env-var.js");

    const child = spawn("node", [scriptFile, key, value, label, required], {
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`❌ Failed to add environment variable.`);
      }
    });
  });

program.parse(process.argv);
