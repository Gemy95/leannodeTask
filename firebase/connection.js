const firebase = require("firebase");

const firebaseConfig = require('../config/env/local').firebaseConfig;

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const User = db.collection("Users");

const Admin = db.collection("Admins");

module.exports = { User, Admin };
