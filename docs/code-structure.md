# 🚀 Project Name: MicroFlame.js

A modular, scalable Node.js backend boilerplate using Express.js. Designed for clean architecture, rapid development, and ease of maintenance.

---

## 📁 Folder Structure & Descriptions

### `config/`

**Purpose**: Centralized configuration using the [`config`](https://www.npmjs.com/package/config) package. Enables dynamic behavior based on environment.

**Contents**:

- `test.js`, `production.js`, `development.js` — Environment-specific settings like `PORT`, `DB_URI`, `JWT_SECRET`.
- `custom-environment-variables.js` — Maps config values to environment variables.

**Example usage**:

```js
const config = require("config");
const port = config.get("port");
```

---

### `constants/`

**Purpose**: Store fixed values reused across the application (e.g., regex patterns, pagination limits, role types) or any other values that needs to be used all over the app.

**Contents**:

- `messages.json` — Reusable user-facing messages.
- `events.json` — Reusable event emitters names.
- `events.json` — Reusable HTTP requests response codes.

---

### `controllers/`

**Purpose**: Handle HTTP requests and return appropriate responses. This project separates controllers into two major folders for clear separation of concerns:

- **`api/`** — Manages API endpoints that return JSON responses (used by front-end apps, mobile clients, etc.).
- **`view/`** — Manages server-rendered views, such as HTML pages or email templates using view engines like Handlebars or EJS.

**Examples**:

- `controllers/api/user.controller.js` — Handles user-related API operations like fetching user info, and profile updates.
- `controllers/view/auth.controller.js` — Renders pages such as the login or sign-up.

More nested logic can be implemented by creating sub folders also
**Examples**:

- `controllers/api/user/profile.controller.js` — Handles user profile-related API operations like fetching user info, and profile updates.
- `controllers/view/auth/login.controller.js` — Renders pages related to login (useful for multiple roles or any different requirement).

This structure promotes clean architecture and makes it easy to scale applications that serve both APIs and rendered views.

---

### `crons/`

**Purpose**: Scheduled jobs that run in the background (e.g., cleanup tasks, sending reports) any function inside will be used in the `start/cron.js` .

---

### `enums/`

**Purpose**: Define and centralize sets of related constants, like statuses or user roles.

**Contents**:

- `otpVerificationTypes.enum.js` — like `verify`, `password`.
- `requestLanguage.enum.js` — like `en`, `ar`.

---

### `events/`

**Purpose**: Custom event emitter for decoupled architecture. Useful for triggering asynchronous actions (e.g., after user creation) used for listening to raised event using different pub-sub providers these folders files are called form `/start/event.js` file.

**Contents**:

- `email.event.js` — Listens to email sending events.

---

### `handlers/`

**Purpose**: Implementation of the listened to event in the `events/` folder.

**Contents**:

- `email.handler.js` — Listens to emailing related events.

**Examples**:

- `emitter.emit("send-verify-otp", {otp:"1234", email:"example@email.com"})` — when this event is emitted the callback is of `emitter.on("send-verify-otp", ({otp, email})=> {//handle})` will handle the logic

So the `event/` folder will include all listener of events and the `handlers/` will include the callbacks implementations

---

### `helpers/`

**Purpose**: Reusable utility functions (e.g., random string generation, time conversions).

---

### `logs/`

**Purpose**: All log files generated from `winston` will be written here. for more details on logging check [`winston`](https://www.npmjs.com/package/winston) package.

**Logging Example**:

```js
const winston = require("winston");

winston.info("App started on port 3000");
winston.error("Database connection failed", err);
```

---

### `middlewares/`

**Purpose**: Contains all middleware functions that interact with requests/responses.

**Contents**:

- `auth/auth.js` — Validates JWT tokens from `Authorization` Header.
  For more details visit [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken).

--

- `upload/` — Upload logic and upload related validations.
  For more details visit [`multer`](https://www.npmjs.com/package/multer).

  example usage on routes

```js
const express = require("express");
const router = express.Router();
const {
  upload,
  validate,
  fileFilter,
} = require("middlewares/upload/uploadWithValidations");

router.post(
  "/",
  [
    upload(fileFilter(["image/png", "image/jpg"])).single("image"),
    checkFileCount(1, 1),
  ],
  api.controller
);

module.exports = router;
```

--

- `response.js` — Handles the formatting of api's responses to keep one response structure
  For this middleware to work, inside each api controller make sure to pass as the example and the response handler will format the response in a standard format for all of the requests

```js
res.code = responseCodes.success;
res.data = {
  /* Any Data */
};
res.message = "<Any message from `constants/message.json`>";
return next();
```

An example is provided in `controllers/api/v1/auth.controller.js`

In the middleware you can find a key called `metadata` in the response this is useful if you want to send common data that needs to be on all requests or some of them like storage url for you files and images, user subscription information, application version for force update, notifications count or any data that might be needed in multiple places, so no need to add them in each place you can just add it in a centralized place just define or fetch it in the `middlewares/response.js` and attache it to the metadata object like this example that will make the storage url attached on all requests.

```js
const responseCodes = require("../constants/responseCodes.json");

module.exports = async function (req, res, next) {
  const { code, data, message, metadata = {} } = res;

  if (!code) return next();

  metadata.storageUrl = "https://storage.url.com";

  return res.status(code).send({
    data,
    success: code === responseCodes.success,
    message,
    metadata,
  });
};
```

You can also add extra data in it from you controller function by simply adding it in this way

```js
res.code = responseCodes.success;
res.data = {
  /* Any Data */
};
res.message = "<Any message from `constants/message.json`>";
res.metadata = {
  /* Any extra data to add to the final response metadata */
};
return next();
```

You can change the response middleware or even not use it by simply returning a response in any way you find convenient but it's recommended to use it to keep a response standard

--

- `error.js` — Central error handler (used at the bottom of middleware stack to catch all errors in the controllers so no need to wrap every controller in a try-catch).

--

---

### `models/`

**Purpose**: Database schemas and models (e.g., Mongoose models).

---

### `public/`

**Purpose**: Serves static files like images, documents, or publicly accessible assets and also includes `js`, `css` folders and folders for uploaded and downloaded files.

**Example**:

- `GET /public/uploads/avatar.png` serves `/public/avatar.png`.

---

### `routes/`

**Purpose**: Define application routes and map them to the appropriate controller handlers. The routes are organized into two major folders to align with the controller structure:

- **`api/`** — Contains routes for API endpoints. These are typically prefixed with `/api` and return JSON data. Useful for RESTful APIs consumed by front-end apps or third-party services.
- **`view/`** — Contains routes that serve views rendered on the server (e.g., HTML pages).

Each base folder must contain an `index.js` file which will map and include all base routes for any thing under it

**Example**:

- `routes/api/index.js` — Defines RESTful routes like `/api/`.
- `routes/view/index.js` — Defines routes like `/`.

For REST we added versioning for the api's so a route like `/api/v1/auth/login`
Would have to be in this path `routes/api/v1/auth.routes.js`

Let's say you want the `/auth` to be a base route you need to do the following
`routes/api/v1/auth/index.js`,

Each `index.js` file inside the routes folders must be like this

```js
const fs = require("fs");
const express = require("express");
const router = express.Router();

fs.readdirSync(__dirname).forEach((file) => {
  if (file.indexOf("index") === -1) {
    const routeName = file.split(".")[0];
    router.use(
      `/${routeName === "home" ? "" : routeName}`,
      require(`./${file}`)
    );
  }
});

module.exports = router;
```

This way whatever subroute you add it will follow the base route
so if you have this folder
`routes/api/v1/auth/index.js`

and you decided to add a reset password route like this `routes/api/v1/auth/reset-password.routes.js`
The `index.js` file will map it and create this router for you `api/v1/auth/reset-password`
And whatever route you have inside the `routes/api/v1/auth/reset-password.routes.js` will be under it for example:

**Sample File: `routes/api/v1/auth/reset-password.routes.js`**

```js
const express = require("express");
const router = express.Router();
const api = require("../../controllers/api/user.controller");

// Handles otp verification via POST
router.post("/verify", api.verifyOTP);

// Sends an OTP to user via POST
router.post("/request-otp", api.requestOTP);

module.exports = router;
```

it will create these two routes `POST api/v1/auth/reset-password/verify` and `POST api/v1/auth/reset-password/request-otp`

**Naming Conventions**:

To maintain consistency and improve readability across the codebase, follow this file naming convention:

- Use **kebab-case** for all filenames (e.g., `reset-password.routes.js`).
- Avoid using `camelCase`, `PascalCase`, or `snake_case` for filenames.

✅ Good: `reset-password.routes.js`, `user.routes.js`  
❌ Bad: `UserRoute.js`, `userRoute.js`, `user_route.js`

This convention is especially useful for microflame scaffolding to create routes automatically based on your file name, and easier to manage across different operating systems.

**Special Case — Default Route Mounting**:

One exception if you haven't notice in the `index.js` files of each base route, is that any `home.routes.js` will result in the route being like this `/`
not `/home`.

For Views routes which will render the `ejs` templates nothing much is changed from the REST routes except the paths should use the `view` folders for both routes and controllers

### `scripts/`

**Purpose**: One-time or periodic scripts, such as seeders, database migrations, or admin utilities.

---

### `services/`

**Purpose**: Business logic and external API/database operations (e.g., reports exporting, payment gate integrations or 3rd party services).

---

### `start/`

**Purpose**: This folder contains all essential startup logic and initial configuration for the application. It helps keep the main `index.js` file clean and modular by moving setup responsibilities into isolated, reusable files.

**Contents**:

- `db.js` — Initializes the database connection.
- `logging.js` — Sets up logging tools (e.g., Winston or custom middleware for logging requests/errors).
- `routes.js` — Registers all app routes and middlewares by loading the appropriate route files and mounting them.
- `config.js` — Loads and validates environment-specific configuration using the centralized config package.
- `cron.js` — Initialize and schedule recurring background tasks using the `node-schedule` package. It's ideal for running jobs like sending emails, generating reports, or syncing data.
- `event.js` — Register and initialize all event listeners for the application. It supports different event-driven communication systems, including the native `EventEmitter`, Redis-based pub/sub, RabbitMQ, or any other messaging service. The goal is to decouple logic (like notifications, emails, logging, etc.) from direct business processes and handle them reactively.
- `sockets.js` _(optional)_ — If your app uses WebSockets or Socket.io, this file can initialize the socket server and define socket event handlers.

**Why this matters**:

- Promotes modularity and separation of concerns.
- Makes the startup process easy to follow and maintain.
- Simplifies testing and debugging by isolating each core setup.

---

### `tests/`

**Purpose**:  
This folder contains all automated tests for your application, including route endpoints, services, utilities, middlewares, and more. Keeping your tests in a dedicated directory helps maintain a clear separation between your test code and your application logic.

The folder has some examples that you can check and follow for more details check the testing stack

---

**Testing Stack**:

- **[Jest](https://jestjs.io/)** — JavaScript testing framework used for running and managing tests.
- **[Supertest](https://github.com/visionmedia/supertest)** — HTTP assertions for testing Express routes and APIs.

---

---

### `validators/`

**Purpose**: Request validation schemas using Joi.

Contains example and can be configured in any way suitable

---

### `views/`

**Purpose**: Template rendering for emails or server-side pages.

**Contents**:

- `/`.ejs` templates for welcome/forgot-password.
- `partial/` — Common wrappers for templates or components like (layouts, head, footer, etc).

---

### `index.js`

**Purpose**:  
This is the **main entry point** of the application. It initializes and starts your Express server and loads all essential startup modules such as logging, database connection, configuration, routes, cron jobs, and event handling.

It’s designed to stay clean and minimal, delegating most of the setup logic to specialized files inside the `start/` directory. This separation ensures that the application is modular, readable, and easy to maintain.

---

**Code Breakdown**:

```js
const winston = require("winston"); // Logging tool
const express = require("express"); // Express framework
require("dotenv").config(); // Load environment variables

const schedule = require("node-schedule"); // Cron job scheduler
const eventEmitter = require("./helpers/event"); // Initialize event emitter
const app = express(); // Create Express app instance

//Then, it loads all the initialization logic:

require("./start/logging")(); // Set up Winston logging and error handling
require("./start/routes")(app); // Register API and view routes
require("./start/db")(); // Connect to the database
require("./start/config")(); // Load and validate config settings
require("./start/cron")(schedule); // Initialize and schedule cron jobs
require("./start/event")(eventEmitter); // Register event listeners

//Finally, it starts the Express server:

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  winston.info(`🚀 MicroFlame App listening on port ${port}...`)
);

module.exports = server;
```

**Best Practices**:

- ✅ Keep `index.js` **minimal** and only use it to **bootstrap** the application.
- 📁 Delegate logic to the appropriate files in the `start/` folder to maintain **modularity and clarity**.
- ⚙️ Always load **environment variables** and perform **configuration validation** at the beginning.
- 🧪 Export the **server instance** to allow easy integration with testing frameworks.
