const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require("cookie-parser");
const path = require('path');

const router = require('./router/router');
const mongodb = require("./utils/util-database");
const app = express();

app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieparser());


app.use(router);

mongodb.connect(() => {
    app.listen(process.env.PORT || 8080, (error) => {
        if(error) console.log('Start server failed');
        console.log('Start server successfully');
    });
})