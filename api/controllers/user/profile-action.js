const User = require("../../../firebase/connection").User;

module.exports = {

    friendlyName: 'Profile',
  
    description: 'Action for get user profile',
  
    exits: {
      notFound: {
        description: 'user error ocurried',
        responseType: 'notFound'
      }
    },
  
    fn: async function () {

        const user = (await User.get()).docs.map((doc) => {
            const user = { id: doc.id, ...doc.data() };
            return user;
          }).filter((user) => {
            return user.id == this.req.user.id;
          })[0];

          delete user.password

          return {
            user
          }

    
      }
    
  };