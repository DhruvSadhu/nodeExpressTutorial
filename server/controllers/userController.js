const mysql = require("mysql");
//create a connection pool (cache of database connections)
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

//view users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("connection error");
      throw err; //something is wrong, not connected
    }
    console.log("Connected as ID " + connection.threadId);
    connection.query("SELECT * FROM user", (err, rows) => {
      //done with connection, release
      connection.release();

      if (!err) {
        res.render("home", { rows });
      } else {
        console.log("Error in db query: ", err);
      }

      console.log("The data from user table: \n", rows);
    });
  });
};

//find by first or last name
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("connection error");
      throw err; //something is wrong, not connected
    }
    console.log("Connected as ID " + connection.threadId);

    let searchTerm = req.body.dhruvSearch;
    console.log("request: ", req);
    console.log("request body: ", req.body);
    // the ? is apparently used to help prevent sql injections
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name like ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        //done with connection, release
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log("Error in db query: ", err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

//search for name?
exports.form = (req, res) => {
  res.render("add-user");
};

exports.newUser = (req, res) => {
  const { newUserFormFirstName, newUserFormLastName, newUserFormEmail, newUserFormPhone, newUserFormComments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("connection error");
      throw err; //something is wrong, not connected
    }
    console.log("Connected as ID " + connection.threadId);
    console.log("request: ", req);
    console.log("request body: ", req.body);
    // the ? is apparently used to help prevent sql injections
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [newUserFormFirstName, newUserFormLastName, newUserFormEmail, newUserFormPhone, newUserFormComments],
      (err, rows) => {
        //done with connection, release
        connection.release();

        if (!err) {
          res.render("add-user", { alert: 'Form submitted!'});
        } else {
          console.log("Error in db query: ", err);
        }

        console.log("The data from form insert: \n", rows);
      }
    );
  });
};
