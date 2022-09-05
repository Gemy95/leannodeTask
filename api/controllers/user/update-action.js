module.exports = {

    friendlyName: 'Update',
  
    description: 'Action for update user',
  
    inputs: {
        userName :{ type:"string", required:false, allowNull:false},
        email :{ type:"string", required:false, allowNull:false},
        password :{ type:"string", required:false, allowNull:false},
        age :{ type:"number", required:false, allowNull:false},
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
      return {
        userName,email,password,age
      };
    }
  };