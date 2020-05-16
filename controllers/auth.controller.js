'use strict';

const mongoose = require('mongoose');
const UserCollection = mongoose.model('User');
const bcrypt = require("bcryptjs");



let comparePass = async (userPassword, databasePassword) => {
    let data = await bcrypt.compareSync(userPassword, databasePassword);
    console.log("&&&&&", data)
    return data;
};

const login = async (req, res) => {
    try {

        let user = await UserCollection.findOne({ userName: req.body.user_mobile });
        if (user == undefined) {
            res.status(400).json({ 'status': 'error', 'data': "User Mobile Number Not found" })
        } else {
            let passwordMatched = await comparePass(req.body.password, user.password);
            if (passwordMatched) {

                let userDetails = {
                    _id: user._id,
                    user_name: user.user_name,
                    access_token: "some test token",
                    access_type: user.access_type
                };

                res.status(200).json(userDetails)
            } else {
                res.status(400).json({ 'status': 'error', 'data': "Password Mismatch" })
            }
        }
    } catch (error) {
        res.status(400).json({ 'status': 'error', 'data': error })
    }
}




module.exports = {
    login: login,
    comparePass:comparePass,
}