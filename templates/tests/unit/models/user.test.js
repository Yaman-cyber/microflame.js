const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");

const { User } = require("../../../models/user.model");

const server = express();
require("../../../start/routes")(server);

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", async () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString() };

    const user = new User(payload);
    const token = await user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivatekey"));
    expect(decoded).toMatchObject(payload);
  });
});

describe("user.verifyPassword", () => {
  it("should return true for a valid password", async () => {
    const user = new User({
      email: "test1@test.com",
      password: "correctPassword",
    });

    await user.save();

    const isValidPassword = await user.verifyPassword("correctPassword");

    await user.deleteOne({});

    expect(isValidPassword).toBe(true);
  });

  it("should return false for an invalid password", async () => {
    // Create a mock user
    const user = new User({
      email: "test2@test.com",
      password: "wrongPassword",
    });

    const isValidPassword = await user.verifyPassword("wrongPassword");

    await user.deleteOne({});

    expect(isValidPassword).toBe(false);
  });
});

describe("userSchema.pre('save')", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should hash the password before saving", async () => {
    // Create a new user instance
    const user = new User({
      email: "test3@test.com",
      password: "password123",
    });

    // Save the user to the database
    await user.save();

    // Retrieve the user from the database
    const savedUser = await User.findOne({ email: "test3@test.com" });

    // Check if the password is hashed
    const isPasswordHashed = await bcrypt.compare("password123", savedUser.password);
    expect(isPasswordHashed).toBe(true);
  });
});
