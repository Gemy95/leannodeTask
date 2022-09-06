const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET_KEY =
  require("../../../config/env/local").ADMIN_JWT_SECRET_KEY;
const Admin = require("../../../firebase/connection").Admin;
const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Login",

  description: "Action for login admin",

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

      const admin = (await Admin.get()).docs
        .map((doc) => {
          const admin = { id: doc.id, ...doc.data() };
          return admin;
        })
        .filter((admin) => {
          return admin.email == email;
        })[0];

      if (!admin) {
        throw { code: "NotFoundError", message: "not found admin" };
      }

      const compareHashedPassword =
        await sails.helpers.compareHashPassword.with({
          password,
          hashedPassword: admin["password"],
        });

      if (!compareHashedPassword) {
        throw { code: "UsageError", message: "wrong password" };
      }

      delete admin.password;

      const token = jwt.sign({ ...admin }, ADMIN_JWT_SECRET_KEY);

      return {
        // admin,
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
