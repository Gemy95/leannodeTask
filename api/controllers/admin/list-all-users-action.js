const User = require("../../../firebase/connection").User;

module.exports = {

    friendlyName: 'List All Usetrs',
  
    description: 'Action for get all users',
  
  
    fn: async function () {

        const page =  parseInt(this.req.query.page) || 0;
        const limit = parseInt(this.req.query.limit) || 0;

        const users = (await User.get()).docs
        .map((doc) => {
          const user = { id: doc.id, ...doc.data() };
          delete user.password;
          return user;
        });

        let totalPages;
        
        if(page>0 && limit>0){
            totalPages = Math.ceil(users.length / limit);
        }

        return {
            users: (page>0 & limit>0) ? users.slice((page-1)*limit, (limit * page)) : users ,
            pagination:{
                page,
                totalPages
            }
        }
        
      }
    
  };