const jwt = require("jsonwebtoken");
const USER_JWT_SECRET_KEY =
  require("../../../config/env/local").USER_JWT_SECRET_KEY;
const User = require("../../../firebase/connection").User;
const bcrypt = require("bcryptjs");
const algoliaService = require("../../../algolia/connection");

module.exports = {
  friendlyName: "Register",

  description: "Action for register new user",

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
            "not valid password , must be has 6 letters and numbers or more",
        };
      }

      const validateAge = await sails.helpers.validateAge.with({ age });

      if (!validateAge) {
        throw {
          code: "UsageError",
          message:
            "not valid age , must be more than or equal 18 and must be less than or equal 50",
        };
      }

      const validateUserName = await sails.helpers.validateUserName.with({
        userName,
      });

      if (!validateUserName) {
        throw {
          code: "UsageError",
          message:
            "not valid userName , must be has 3 letters and numbers or more",
        };
      }

      const allUsers = (await User.get()).docs.map((doc) => {
        const user = { id: doc.id, ...doc.data() };

        if (userName == user.userName) {
          throw { code: "E_UNIQUE", message: "username already exists" };
        }

        if (email == user.email) {
          throw { code: "E_UNIQUE", message: "email already exists" };
        }
        return user;
      });

      const token = jwt.sign({ userName, email, age }, USER_JWT_SECRET_KEY);

      const hashedPassword = await sails.helpers.hashPassword.with({
        password,
      });

      const result = await User.add({
        userName,
        email,
        password: hashedPassword,
        age,
      })
        .then(async function (docRef) {
          await algoliaService.addUser({
            objectID: docRef.id,
            userName,
            email,
            password: hashedPassword,
            age,
          });
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
          throw error;
        });
      return {
        statusCode: 200,
        // user: { userName, email, password, age },
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
