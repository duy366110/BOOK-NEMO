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

const router = require('./router/router');
const mongodb = require("./utils/util-database");
const csurfProtection = csurf({cookie: true});

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT,
    'client_secret': process.env.SERECT
});

const store = new sessionstore({
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/book_nemo',
    collection: 'session'
})

const app = express();

app.use(express.static(path.join(__dirname, 'public')));


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

mongodb.connect(() => {
    app.listen(process.env.PORT || 8080, (error) => {
        if(error) console.log('Start server failed');
        console.log('Start server successfully');
    });
})