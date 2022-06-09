require('custom-env').env('api');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const port = process.env.PORT;
const tasks = require('./routes/Routes');
const url = process.env.MONGO_URI;
//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(express.static(__dirname+'/views/LoginForm'));
app.use(express.static('./uploads'));

app.use(session({
    secret: 'SecretStringForCookies',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use('/', tasks);
const start = async () => {
    try {
        await mongoose.connect(url);
        console.log("DB CONNECTED...");
        app.listen(port, console.log(`listening to port ${port}...`));
    } catch (err) {
        console.log(err);
        
    }
}

start()

