const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require("cookie-parser");
const session = require('express-session');
const sessionstore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csurf = require('csurf');
const multer = require('multer');
const cloudinary = require("./utils/util-cloudinary");
const path = require('path');
const paypal = require('paypal-rest-sdk');
const compression = require("compression");

const router = require('./router/router');
const mongodb = require("./utils/util-database");
const csurfProtection = csurf({cookie: true});

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.CLIENT || "AROBkgnUtFyaUFo3B1ieXOzWb_Lr4sE9eGIfMiWFfMXs9TRzhHN8_eYFu51TAbEsxyK__FVQhhZ5b6KE",
    'client_secret': process.env.SERECT || "EM4D6ERyiu8ymqKZNrpP7nYdEGVwabY_9JfHaDooxPUBy461ZjBVjvoryIaWPuu7YAepIZ0ULz9VaUYD"
});

const store = new sessionstore({
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book_nemo',
    collection: 'session'
})

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'secret_application_book_nemo_366110',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(cookieparser());
app.use(csurfProtection);
app.use(flash());

app.use(multer({storage: cloudinary.storage}).single("image"));

app.use(router);

module.exports = app;