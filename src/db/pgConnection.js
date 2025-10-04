const { Client, Result } = require("pg");
// to define the routes to be used, you will need express to that, so you will import it and define the app and use the app variable to create the CRUD operations
const express = require("express");
// define the host name,username and port
// const app = express();

// without the above you will not be able to pass in the json into the js request object
// app.use(express.json());

const connection = new Client({
  // You can put this info in an env file to protect it.Do not push straight away to git since it might not be safe.
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "todoapp",
});

// Create a table in the database in postgressql

connection.connect().then(() => console.log("connected"));

module.exports = connection;

