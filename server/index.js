//A cookie is a small key and user data is stored in a database and not on the website anymore
//There is one cookie per person per website
//Sessions are kept on servers
//Server receives a cookie from the browser
//Sessions are empty objects, kept on servers and they correspond to a client's cookies
//

require('dotenv').config();
const express = require('express');
const massive = require('massive');
// require session
const session = require('express-session');
const auth = require('./authController');
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env;

const app = express();

// Top level middleware
app.use(express.json());
app.use(session({
    resave: false, //should active sessions save if no changes made to them?
    saveUninitialized: true, //should a new session save if no data was added?
    secret: SESSION_SECRET, //random string to protect the cookie - this is stored in the .env file
    cookies: { //max age of the cookie in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7 //milliseconds, seconds in a minute, seconds in an hour -- One Week Long
    }
}))

//By invoking massive, we are connecting to the database
massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then( db => {
    app.set('db', db);
    console.log('Ahoy! Connected to db, matey')
}).catch( err => console.log(err));

// Enpoints

app.listen(SERVER_PORT, () => console.log(`Connected to port ${SERVER_PORT}⛵⚓`))
