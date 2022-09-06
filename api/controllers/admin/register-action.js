const jwt = require("jsonwebtoken");
const ADMIN_JWT_SECRET_KEY =
  require("../../../config/env/local").ADMIN_JWT_SECRET_KEY;
const Admin = require("../../../firebase/connection").Admin;
const bcrypt = require("bcryptjs");

module.exports = {

  friendlyName: "Register",

  description: "Action for register new admin",

  inputs: {
    userName: { type: "string", required: true, allowNull: false },
    email: { type: "string", required: true, allowNull: false },
    password: { type: "string", required: true, allowNull: false },
    age: { type: "number", required: true, allowNull: false },
  },

  fn: async function ({ userName, email, password, age }) {
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
            "not valid password , should be more than 6 characters contains numbers and letters",
        };
      }

      const validateAge = await sails.helpers.validateAge.with({ age });

      if (!validateAge) {
        throw {
          code: "UsageError",
          message:
            "not valid age , should be between 18 and 50",
        };
      }

      const validateUserName = await sails.helpers.validateUserName.with({
        userName,
      });

      if (!validateUserName) {
        throw {
          code: "UsageError",
          message:
            "not valid userName , should be more than or equal 3 characters contains numbers and letters",
        };
      }

      const allAdmins = (await Admin.get()).docs.map((doc) => {
        const admin = { id: doc.id, ...doc.data() };

        if (userName == admin.userName) {
          throw { code: "E_UNIQUE", message: "username already exists" };
        }

        if (email == admin.email) {
          throw { code: "E_UNIQUE", message: "email already exists" };
        }
        return admin;
      });

      const token = jwt.sign({ userName, email, age }, ADMIN_JWT_SECRET_KEY);

      const hashedPassword = await sails.helpers.hashPassword.with({
        password,
      });

      await Admin.add({ userName, email, password: hashedPassword, age });

      return {
        statusCode: 200,
        // admin: { userName, email, password, age },
        // token,
      };
    } catch (error) {
      if (error.code === "UsageError") {
        return this.res.status(403).send({ message: error.message });
      } else if (error.code === "E_UNIQUE") {
        return this.res.status(422).send({ message: error.message });
      }
      return this.res.status(400).send({ message: error.message });
    }
  },
};
