const mysql      = require('mysql');
const myModule = require('./credentials.js');

let dbhost = myModule.host();
let dbuser = myModule.user();
let dbpassword = myModule.password();
let dbdatabase = myModule.database();

//connect to mysql db
console.log("Get connection...");

var conn = mysql.createConnection({
  host     : dbhost,
  user     : dbuser,
  password : dbpassword,
  database : dbdatabase
});

conn.connect((err) => {
    if(err){
      console.log('Error connecting to db');
      return;
    }
    console.log('Connection established');
  });

module.exports = conn;