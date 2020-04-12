require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
//const express_urls = require('express-urllib');
const cors = require('cors');

//cors headers
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token");
//     res.setHeader('Access-Control-Expose-Headers', '*');
//     //Access-Control-Expose-Headers: *
//     next();
// });
app.use(cors());

//support parsing of url params
//express_urls(app);

// support parsing of application/json type post data
app.use(bodyParser.json());

//routes
routes(app);

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening to port " + port);
});

module.exports = app;
