const functions = require("firebase-functions");
const client = algoliasearch("33W5ZCCD39", "18bd6c3b14bce6f596846b4e93516dc4");
const index = client.initIndex("Users");

//////////////// it is need a subscription to be work from firebase //////////////////
// i used direct function to connect algolia from algolia folder ////////////////

exports.addToUser = functions.firestore
  .document("/users/{userId}")
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;
    return index.addObject({ ...data, objectID });
  });


exports.updateUser = functions.firestore
  .document("/users/{userId}")
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.addObject({ ...newData, objectID });
  });


exports.deleteUser = functions.firestore
  .document("/users/{userId}")
  .onDelete((snapshot) => index.deleteObject(snapshot.id));
