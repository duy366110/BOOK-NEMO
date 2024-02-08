require('dotenv').config();
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
require("./utils/util-database");
const csurfProtection = csurf({cookie: true});
const Helper = require("./helpers/helper");

const CONFIG_MONGODB  = require("./configs/config.mongodb");
const CONFIG_PAYPAL = require("./configs/config.paypal");

// KIỂM TRA LƯỢNG TRUY CẬP CÓ QUÁ LỚN  - CẦN NÂNG CẤP HỆ THỐNG (LƯỢNG QUÁ TẢI HỆ THỐNG)
Helper.overloadSystem();

paypal.configure({
    'mode': 'sandbox',
    'client_id': CONFIG_PAYPAL.CLIENT,
    'client_secret': CONFIG_PAYPAL.SERECT,
});

console.log(CONFIG_MONGODB.URI);

const store = new sessionstore({
    uri: CONFIG_MONGODB.URI,
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