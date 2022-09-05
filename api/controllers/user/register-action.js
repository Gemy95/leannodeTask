const jwt = require('jsonwebtoken');
const USER_JWT_SECRET_KEY= require('../../../config/env/local').USER_JWT_SECRET_KEY;

module.exports = {

    friendlyName: 'Register',
  
    description: 'Action for register new user',
  
    inputs: {
        userName :{ type:"string", required:true, allowNull:false},
        email :{ type:"string", required:true, allowNull:false},
        password :{ type:"string", required:true, allowNull:false},
        age :{ type:"number", required:true, allowNull:false},
    },
  
    exits: {
    //   success: {
    //     responseType: 'view',
    //     viewTemplatePath: 'pages/welcome'
    //   },
      notFound: {
        description: 'user error ocurried',
        responseType: 'notFound'
      }
    },
  
    fn: async function ({userName,email,password,age}) {
  
      // Look up the user whose ID was specified in the request.
      // Note that we don't have to validate that `userId` is a number;
      // the machine runner does this for us and returns `badRequest`
      // if validation fails.
    //   var user = await User.findOne({ id: userId });
  
    //   // If no user was found, respond "notFound" (like calling `res.notFound()`)
    //   if (!user) { throw 'notFound'; }
  
      // Display a personalized welcome view.

      const token = jwt.sign({ userName,email,age }, USER_JWT_SECRET_KEY);

      return {
       user: {userName,email,password,age},
       token
      };
    }
  };