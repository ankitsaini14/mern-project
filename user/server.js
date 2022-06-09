require('custom-env').env('api');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const router = require("../user/routes/Routes");
const userPort = process.env.USERPORT;
const url = process.env.MONGO_URI;
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

const start = async () => {
    try {
        await mongoose.connect(url);
        console.log("DB CONNECTED...");
        app.listen(userPort, console.log(`listening to port ${userPort}...`));
    } catch (err) {
        console.log(err);
        
    }
}

start();