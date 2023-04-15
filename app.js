const express = require("express");
const exphbs = require("express-handlebars");
// helps pass data thru forms 
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// Parsing middleware
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//Parse application/json
app.use(bodyParser.json());

//for static files
//now any files located in the 'public' directory can be accessed using their respective URLS
//relative to the root of the application
//eg, main.css can be accessed at localhost:PORT/main.css
app.use(express.static('public'));


//Register a templating engine, for rednering of dynamic content, enables use of placeholders for data
//default file extension is .handlebars, this shortens it
app.engine('hbs', exphbs.engine({'extname':'.hbs'}));
app.set('view engine', 'hbs');


//create a connection pool (cache of database connections)
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME

});

//connect to database
pool.getConnection( (err, connection)=> {
    if (err){
        console.log("connection error");
        throw err; //something is wrong, not connected
    }
    console.log('Connected as ID ' + connection.threadId);
})



const routes = require("./server/routes/user");
app.use("/", routes);



app.listen(port, ()=> {
    console.log(`listening on port ${port}`)
})