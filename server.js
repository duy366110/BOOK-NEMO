"use strict"
const app = require("./src/index");

app.listen(process.env.PORT || 8080, (error) => {
    if(error) console.log('Start server failed');
    console.log('Start server successfully');
});