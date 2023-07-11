const express = require('express');
const bodyparser = require('body-parser');

const router = require('./router/router');
const mongodb = require("./utils/util-database");
const app = express();


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());


app.use(router);


mongodb.connect(() => {
    app.listen(process.env.PORT || 8080, (error) => {
        if(error) console.log('Start server failed');
        console.log('Start server successfully');
    });
})