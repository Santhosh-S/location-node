var express = require('express');
var router = express.Router();



module.exports = function (app) {
    //Middle ware that is specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });

    app.get('/test', function (req, res) {
        res.send("API works");
    })


    app.post('/login', require('./controllers/auth.controller').login);
    app.post('/singup', require('./controllers/user.controller').create_user);
    app.get('/all_users',require('./controllers/user.controller').get_all_users);
    app.post('/save_location', require('./controllers/user.controller').update_user_location);

    // app.get('/getToken', require('./controllers/youtube.api.controller').getToken);
}