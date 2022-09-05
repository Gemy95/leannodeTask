const bcrypt = require('bcryptjs');

module.exports = {

    friendlyName: 'Hash Password',
  
    description: 'Return a hashed password using bycrpt',
  
    inputs: {
      password: {
        type: 'string',
        description: 'pass',
        required: true
      }
    },


  exits: {

    success: {
      description: 'All done.',
    },

  },
  
  
    fn: async function (inputs, exits) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(inputs.password, salt)
      return exits.success(hash);
    }
  
  };