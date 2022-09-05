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

  exits: {
    notFound: {
      description: "user error ocurried",
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

    const user = (await User.get()).docs
      .map((doc) => {
        const user = { id: doc.id, ...doc.data() };
        return user;
      })
      .filter((user) => {
        return user.email == email;
      })[0];

    if (!user) {
      throw "not Found user";
    }

    const compareHashedPassword = await sails.helpers.compareHashPassword.with({
      password,
      hashedPassword: user["password"],
    });

    if (!compareHashedPassword) {
      throw "wrong password";
    }

    delete user.password;

    const token = jwt.sign({ ...user }, USER_JWT_SECRET_KEY);

    return {
     // user,
      token,
    };
  },
};
