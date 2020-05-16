'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', 3000);

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,webToken');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

var validateToken = function (req, res, next) {
    if (req.originalUrl == '/login') {
        console.log(req.originalUrl)
        next()
    } else {
        next()
    }
}

app.use(validateToken)

var userSchema = require(path.resolve('./schema/user.schema.js'));
var locationSchema = require(path.resolve('./schema/location.schema.js'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/location', { useNewUrlParser: true, useUnifiedTopology: true });


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we are connected to database");
});

var routes = require('./routes');  //module you want to include

routes(app)



app.listen(app.get('port'), () => {
    console.log('Express server started');
    require('./controllers/user.controller').create_admin()
});

module.exports = app