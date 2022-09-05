module.exports = {


  friendlyName: 'Validate email',


  description: '',


  inputs: {
    email: {
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
    return String(inputs.email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }


};

