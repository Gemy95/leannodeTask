const algoliasearch = require("algoliasearch");
const algoliaCongig = require("../config/env/local").algoliaConfig;

const client = algoliasearch(algoliaCongig.applicationID, algoliaCongig.adminAPIKey);
const index = client.initIndex("Users");

exports.addUser = (data) => {
  index
    .saveObjects([data])
    .then(({ objectIDs }) => {
    })
};


exports.searchUser = (search) => {
  return index
    .search(search)
    .then(({ hits }) => {
      return hits.map((item)=>{
        delete item._highlightResult;
        return item;
      });
    })
};
