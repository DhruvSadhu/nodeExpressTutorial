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
    connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name like ?', ['%'+searchTerm+'%','%'+searchTerm+'%'], (err, rows) => {
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
