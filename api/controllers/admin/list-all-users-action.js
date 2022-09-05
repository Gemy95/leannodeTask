const User = require("../../../firebase/connection").User;

module.exports = {

    friendlyName: 'List All Usetrs',
  
    description: 'Action for get all users',
  
  
    fn: async function () {

        const users = (await User.get()).docs
        .map((doc) => {
          const user = { id: doc.id, ...doc.data() };
          delete user.password;
          return user;
        });

        return {
            users
        }
        
      }
    
  };