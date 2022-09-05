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

  exits: {
    notFound: {
      description: "user error ocurried",
      responseType: "notFound",
    },
  },

  fn: async function ({ userName, email, password, age }) {
    
    let updatedUser={};

    if (userName) {
      const validateUserName = await sails.helpers.validateUserName.with({ userName });

      if (!validateUserName) {
        throw "not valid userName , must be has 3 letters and numbers or more";
      }
      updatedUser['userName']= userName;
    }

    if (email) {
      const validateEmail = await sails.helpers.validateEmail.with({ email });

      if (!validateEmail) {
        throw "not valid email";
      }
      updatedUser['email']= email;
    }
    
    if (password) {
      const validatePassword = await sails.helpers.validatePassword.with({
        password,
      });

      if (!validatePassword) {
        throw "not valid password , must be has 6 letters and numbers or more";
      }
      const hashedPassword = await sails.helpers.hashPassword.with({ password });
      updatedUser['password']= hashedPassword;
    }

    if (age) {
      const validateAge = await sails.helpers.validateAge.with({ age });

      if (!validateAge) {
        throw "not valid age , must be more than or equal 18 and must be less than or equal 50";
      }
      updatedUser['age']= age;
    }

    const user = (await User.get()).docs.map((doc) => {
      const user = { id: doc.id, ...doc.data() };

      if (userName && userName == user.userName) {
        throw "username already exists";
      }

      if (email && email == user.email) {
        throw "email already exists";
      }

      return user;
    }).filter((user) => {
      return user.id == this.req.user.id;
    })[0];

    const result= Object.assign(user,updatedUser);

    await User.doc(this.req.user.id).update(result);

    return {
      statusCode:200
    };
  },
};
