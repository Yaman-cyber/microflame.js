const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../../../../models/user.model");
const auth = require("../../../../middlewares/auth/auth");
const messages = require("../../../../constants/messages.json");

describe("Auth middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
      lang: "en",
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no token is provided", async () => {
    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      unAuthorized: true,
      message: messages[req.lang].unAuthorized,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", async () => {
    req.header.mockReturnValue("invalidToken");

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      unAuthorized: true,
      message: messages[req.lang].unAuthorized,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should set req.user and call next if the token is valid", async () => {
    const validToken = jwt.sign({ _id: "validId" }, config.get("jwtPrivatekey"));
    req.header.mockReturnValue(validToken);

    // Mock User.findOne to return a valid user
    User.findById = jest.fn().mockReturnValue({ _id: "validId" });

    await auth(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("validId");

    expect(req.user).toEqual({ _id: "validId" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
