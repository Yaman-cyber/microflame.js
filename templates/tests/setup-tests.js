const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.test" });

const db = `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_HOST}/${process.env.DB_NAME}`;

beforeAll(async () => {
  await mongoose.connect(db);
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
