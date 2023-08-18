const mongodb = require("./src/utils/util-database");
const app = require("./src/index");

mongodb.connect(() => {
    app.listen(process.env.PORT || 8080, (error) => {
        if(error) console.log('Start server failed');
        console.log('Start server successfully');
    });
})