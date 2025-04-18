const request = require("supertest");
const express = require("express");

const { User } = require("../../models/user.model");
const messages = require("../../constants/messages.json");

const server = express();
require("../../start/routes")(server);

describe("/api/v1/auth", () => {
  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const testUser = new User({ email: "testuser1@example.com", password: "correctPassword", verifiedAt: new Date() });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({ email: "testuser1@example.com", password: "correctPassword" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.token).toBeDefined();
    });

    it("should not login with invalid credentials", async () => {
      const testUser = new User({ email: "testuser2@example.com", password: "correctPassword", verifiedAt: new Date() });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({
        email: "testuser2@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toEqual(messages.en.invalidCredentials);
    });

    it("should not return token if user is not verified", async () => {
      const testUser = new User({ email: "testuser3@example.com", password: "correctPassword" });

      await testUser.save();

      const response = await request(server).post("/api/v1/auth/login").send({ email: "testuser3@example.com", password: "correctPassword" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeNull();
      expect(response.body.message).toEqual(messages.en.verifyAccountFirst);
    });

    it("should not login if user doesn't exist", async () => {
      const response = await request(server).post("/api/v1/auth/login").send({ email: "testuser4@example.com", password: "wrongPassword" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toEqual(messages.en.noUser);
    });
  });

  describe("POST /signup", () => {
    it("should signup a new user", async () => {
      const userData = { email: "testuser5@example.com", password: "password123" };

      const response = await request(server).post("/api/v1/auth/signup").send(userData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toEqual(messages.en.signupSuccess);
    });

    it("should fail if email is registered", async () => {
      const testUser = new User({ email: "testuser6@example.com", password: "correctPassword" });

      await testUser.save();

      const userData = { email: "testuser6@example.com", password: "password123" };

      const response = await request(server).post("/api/v1/auth/signup").send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});
