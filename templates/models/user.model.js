const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },

    image: { type: String, default: null },

    password: { type: String, required: true },

    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/*################# Add methods for each instance #################*/

/**
 * Generate an authentication token for the user.
 * @returns {string} The generated authentication token.
 */
userSchema.methods.generateAuthToken = async function (req) {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivatekey"), { expiresIn: "30d" });

  return token;
};

/**
 * Verify the user's password.
 * @param {string} password - The password to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, otherwise false.
 */
userSchema.methods.verifyPassword = async function (password) {
  try {
    const validPassword = await bcrypt.compare(password, this?.password);

    if (!validPassword) return false;
    return true;
  } catch (error) {
    return false;
  }
};

/*################# Add middlewares to handle behaviors based on some changes #################*/

//Hash password every time it's changed
userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    const salt = bcrypt.genSaltSync(saltRounds);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  next();
});

const User = mongoose.model("User", userSchema);

exports.User = User;
