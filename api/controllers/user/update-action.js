const jwt = require("jsonwebtoken");
const USER_JWT_SECRET_KEY =
  require("../../../config/env/local").USER_JWT_SECRET_KEY;
const User = require("../../../firebase/connection").User;
const bcrypt = require("bcryptjs");

module.exports = {
  friendlyName: "Update",

  description: "Action for update user",

  inputs: {
    userName: { type: "string", required: false, allowNull: false },
    email: { type: "string", required: false, allowNull: false },
    password: { type: "string", required: false, allowNull: false },
    age: { type: "number", required: false, allowNull: false },
  },

  fn: async function ({ userName, email, password, age }) {
    try {
      let updatedUser = {};

      if (userName) {
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
        updatedUser["userName"] = userName;
      }

      if (email) {
        const validateEmail = await sails.helpers.validateEmail.with({ email });

        if (!validateEmail) {
          throw { code: "UsageError", message: "not valid email" };
        }
        updatedUser["email"] = email;
      }

      if (password) {
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
        const hashedPassword = await sails.helpers.hashPassword.with({
          password,
        });
        updatedUser["password"] = hashedPassword;
      }

      if (age) {
        const validateAge = await sails.helpers.validateAge.with({ age });

        if (!validateAge) {
          throw {
            code: "UsageError",
            message:
              "not valid age , should be between 18 and 50",
          };
        }
        updatedUser["age"] = age;
      }

      const user = (await User.get()).docs
        .map((doc) => {
          const user = { id: doc.id, ...doc.data() };

          if (userName && userName == user.userName) {
            throw { code: "E_UNIQUE", message: "username already exists" };
          }

          if (email && email == user.email) {
            throw { code: "E_UNIQUE", message: "email already exists" };
          }

          return user;
        })
        .filter((user) => {
          return user.id == this.req.user.id;
        })[0];

      const result = Object.assign(user, updatedUser);

      await User.doc(this.req.user.id).update(result);

      return {
        statusCode: 200,
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
