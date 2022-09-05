module.exports = {


  friendlyName: 'Validate userName',


  description: '',


  inputs: {
    userName: {
      type: 'string',
      description: 'un',
      required: true
    }
  },


exits: {

  success: {
    description: 'All done.',
  },

},


fn: async function (inputs) {
  return String(inputs.userName)
  .match(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/
  );
}

};

