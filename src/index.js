const express = require('express');
const bodyparser = require('body-parser');
const app = express();


app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());


app.use("/", (req, res, next) => {
    res.status(200).json({status: true, message: 'Create project successfully'});
})



app.listen(process.env.PORT || 8080, (error) => {
    if(error) console.log('Start server failed');
    console.log('Start server successfully');
});