const algoliasearch = require("algoliasearch");

const client = algoliasearch("33W5ZCCD39", "18bd6c3b14bce6f596846b4e93516dc4");
const index = client.initIndex("Users");

exports.addUser = (data)=>{
    index
    .saveObjects([data])
    .then(({ objectIDs }) => {
      console.log(objectIDs);
    })
    .catch(err => {
      console.log(err);
    });}


