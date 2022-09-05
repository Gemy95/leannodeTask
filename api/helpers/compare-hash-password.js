const bcrypt = require('bcryptjs');

module.exports = {

    friendlyName: 'Hash Password',
  
    description: 'Return a compare hashed password using bycrpt',
  
    inputs: {
      password: {
        type: 'string',
        description: 'pass',
        required: true
      },
      hashedPassword: {
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
  
  
    fn: async function (inputs) {
      return bcrypt.compareSync(inputs.password, inputs.hashedPassword);
    }
  
  };