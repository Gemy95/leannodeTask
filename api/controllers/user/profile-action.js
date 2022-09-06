const User = require("../../../firebase/connection").User;

module.exports = {
  friendlyName: "Profile",

  description: "Action for get user profile",

  fn: async function () {

    try {
      
      const user = (await User.get()).docs
        .map((doc) => {
          const user = { id: doc.id, ...doc.data() };
          return user;
        })
        .filter((user) => {
          return user.id == this.req.user.id;
        })[0];

      if (!user) {
        throw { code: "NotFoundError", message: "not found this user" };
      }

      delete user.password;

      return {
        user,
      };

    } catch (error) {
      if (error.code === "NotFoundError") {
        return this.res.status(404).send({ message: error.message });
      }
      return this.res.status(400).send({ message: error.message });
    }
  },
};
