module.exports = {


  friendlyName: 'Validate age',


  description: '',


  inputs: {
    age: {
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
    const age= parseInt(inputs.age);
    return ( age >= 18 && age <= 50)
  }


};

