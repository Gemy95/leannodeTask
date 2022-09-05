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

  exits: {
    notFound: {
      description: "admin error ocurried",
      responseType: "notFound",
    },
  },

  fn: async function ({ userName, email, password, age }) {
    const validateEmail = await sails.helpers.validateEmail.with({ email });

    if (!validateEmail) {
      throw "not valid email";
    }

    const validatePassword = await sails.helpers.validatePassword.with({ password });

    if (!validatePassword) {
      throw "not valid password , must be has 6 letters and numbers or more";
    }

    const validateAge = await sails.helpers.validateAge.with({ age });

    if (!validateAge) {
      throw "not valid age , must be more than or equal 18 and must be less than or equal 50";
    }

    const validateUserName = await sails.helpers.validateUserName.with({ userName });

    if (!validateUserName) {
      throw "not valid userName , must be has 3 letters and numbers or more";
    }

    const allAdmins = (await Admin.get()).docs.map((doc) => {
      const admin = { id: doc.id, ...doc.data() };

      if (userName == admin.userName) {
        throw "username already exists";
      }

      if (email == admin.email) {
        throw "email already exists";
      }
      return admin;
    });

    const token = jwt.sign({ userName, email, age }, ADMIN_JWT_SECRET_KEY);

    const hashedPassword = await sails.helpers.hashPassword.with({ password });

    await Admin.add({ userName, email, password: hashedPassword, age });

    return {
      statusCode:200,
      // admin: { userName, email, password, age },
      // token,
    };
  },
};
