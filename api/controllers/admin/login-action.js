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

  exits: {
    notFound: {
      description: "admin error ocurried",
      responseType: "notFound",
    },
  },

  fn: async function ({ email, password }) {
    const validateEmail = await sails.helpers.validateEmail.with({ email });

    if (!validateEmail) {
      throw "not valid email";
    }

    const validatePassword = await sails.helpers.validatePassword.with({
      password,
    });

    if (!validatePassword) {
      throw "not valid password , must be has 6 letters and numbers or more";
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
      throw "not Found admin";
    }

    const compareHashedPassword = await sails.helpers.compareHashPassword.with({
      password,
      hashedPassword: admin["password"],
    });

    if (!compareHashedPassword) {
      throw "wrong password";
    }

    delete admin.password;

    const token = jwt.sign({ ...admin }, ADMIN_JWT_SECRET_KEY);

    return {
     // admin,
      token,
    };
  },
};
