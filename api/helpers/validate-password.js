module.exports = {


  friendlyName: 'Validate password',


  description: '',


  inputs: {
    password: {
      type: 'string',
      description: 'em',
      required: true
    }
  },


exits: {

  success: {
    description: 'All done.',
  },

},


fn: async function (inputs) {
  return String(inputs.password)
  .match(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
  );
}

};

