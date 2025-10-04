const { Client, Result } = require("pg");
// to define the routes to be used, you will need express to that, so you will import it and define the app and use the app variable to create the CRUD operations
const express = require("express");
// define the host name,username and port
const app = express();

// without the above you will not be able to pass in the json into the js request object
app.use(express.json());

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

// Define the API routes now.
// create items in table
app.post("/postdata", (req, res) => {
  console.log("Received POST request:", req.body);

  const { id, title, description, due_date, priority, completed } = req.body;

  const post_query =
    "INSERT INTO tasks (id,title,description,due_date,priority,completed) VALUES ($1,$2,$3,$4,$5,$6)";

  connection.query(
    post_query,
    [id, title, description, due_date, priority, completed],
    (err, result) => {
      if (err) {
        console.error("Postgres error:", err);
        res.status(500).json({ error: err.message, code: err.code });
      } else if (title == "") {
        console.error("No title specified", err);
        res.status(500).json({ error: err.message, code: err.code });
      } else {
        // this is to return request body( what you posted back in postman)(use, req.body)
        res.json(req.body);
        console.log(result);
      }
    }
  );
});

// get all data

app.get("/fetchdata", (req, res) => {
  console.log("Recieved get request: ", req.body);

  const fetch_query = "Select * from tasks";
  connection.query(fetch_query, (err, result, next) => {
    if (err) {
      res.send("Postgres error:", err);
    } else {
      res.send(result.rows);
    }
  });
});

// fetch sorted data
app.get("/fetchbySorted", (req, res) => {
  const fetch_query = "SELECT * FROM tasks ORDER BY priority, due_date";

  connection.query(fetch_query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result.rows);
    }
  });
});

// filter by completion status
app.get("/fetchbycompleted/:completeStatus", (req, res) => {
  const completeStatus = req.params.completeStatus;

  let statusValue = false;
  if (completeStatus === "completed") {
    statusValue = true;
  } else {
    statusValue = false;
  }

  const fetch_query = "SELECT * FROM tasks WHERE completed = $1";

  connection.query(fetch_query, [completeStatus], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result.rows);
    }
  });
});

// delete item by title
app.delete("/deletebyTitle/:title", (req, res) => {
  const title = req.params.title;
  const delete_query = "Delete from tasks where title = $1";
  connection.query(delete_query, [title], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      //  res.json(result)
      res.send(result.rows);
    }
  });
});

// for now,update all parts seperaetely
app.p("/updateid/:id", (req, res) => {
  const id = req.params.id;
  const title = req.params.title;

  const update_query = "UPDATE tasks SET title = $1 WHERE id = $2";
  connection.query(update_query, [title, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Title Updated");
      console.log(result);
    }
  });
});

app.put("/updatedescription/:id", (req, res) => {
  const id = req.params.id;
  const description = req.body.description;

  const update_query = "UPDATE tasks SET description = $1 WHERE id = $2";
  connection.query(update_query, [description, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("description Updated");
      console.log(result);
    }
  });
});

app.put("/updatedueDate/:id", (req, res) => {
  const id = req.params.id;
  const due_date = req.body.due_date;

  const update_query = "UPDATE tasks SET due_date = $1 WHERE id = $2";
  connection.query(update_query, [due_date, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Due date Updated");
      console.log(result);
    }
  });
});
app.put("/updatepriority/:id", (req, res) => {
  const id = req.params.id;
  const priority = req.body.priority;

  const update_query = "UPDATE tasks SET priority = $1 WHERE id = $2";
  connection.query(update_query, [priority, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Due date Updated");
      console.log(result);
    }
  });
});

// update the completed checkbox
app.put("/updateCompleted/:id", (req, res) => {
  const id = req.params.id;
  const completed = req.params.completed;

  const update_query = "UPDATE tasks SET completed = $1 WHERE id=$2";
  connection.query(update_query, [completed, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Item has been completed");
      console.log(result);
    }
  });
});

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server!`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
