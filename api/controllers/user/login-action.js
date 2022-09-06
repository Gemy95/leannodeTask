const jwt = require("jsonwebtoken");
const USER_JWT_SECRET_KEY =
  require("../../../config/env/local").USER_JWT_SECRET_KEY;
const User = require("../../../firebase/connection").User;
const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Login",

  description: "Action for login user",

  inputs: {
    email: { type: "string", required: true, allowNull: false },
    password: { type: "string", required: true, allowNull: false },
  },

  fn: async function ({ email, password }) {
    try {
      const validateEmail = await sails.helpers.validateEmail.with({ email });

      if (!validateEmail) {
        throw { code: "UsageError", message: "not valid email" };
      }

      const validatePassword = await sails.helpers.validatePassword.with({
        password,
      });

      if (!validatePassword) {
        throw {
          code: "UsageError",
          message:
            "not valid password , must be has 6 letters and numbers or more",
        };
      }

      const user = (await User.get()).docs
        .map((doc) => {
          const user = { id: doc.id, ...doc.data() };
          return user;
        })
        .filter((user) => {
          return user.email == email;
        })[0];

      if (!user) {
        throw { code: "NotFoundError", message: "not found this user" };
      }

      const compareHashedPassword =
        await sails.helpers.compareHashPassword.with({
          password,
          hashedPassword: user["password"],
        });

      if (!compareHashedPassword) {
        throw { code: "UsageError", message: "wrong password" };
      }

      delete user.password;

      const token = jwt.sign({ ...user }, USER_JWT_SECRET_KEY);

      return {
        // user,
        token,
      };
    } catch (error) {
      if (error.code === "UsageError") {
        return this.res.status(403).send({ message: error.message });
      } else if (error.code === "E_UNIQUE") {
        return this.res.status(422).send({ message: error.message });
      }
      if (error.code === "NotFoundError") {
        return this.res.status(404).send({ message: error.message });
      }
      return this.res.status(400).send({ message: error.message });
    }
  },
};
