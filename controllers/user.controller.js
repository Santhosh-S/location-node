
'use strict';

const mongoose = require('mongoose');
const UserCollection = mongoose.model('User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let create_user = async (req, res) => {
    try {
        if (req.body.user_name && req.body.user_mobile && req.body.password) {
            if (await _checkUserExist(req.body.user_mobile)) {
                res.json(400, { 'status': 'error', 'data': "Mobile Number already Exists" })
            } else {
                console.log("user data", req.body.user_mobile + '-' + req.body.password)
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
                req.body.access_type = "normal_user";
                var models = new UserCollection(req.body);
                var inserted = await models.save();

                res.json(201, inserted);
            }
        } else {
            res.json(400, { 'status': 'error', 'data': "Required fileds missing" })

        }

    } catch (error) {
        console.log(error);
        res.json(400).json({ 'status': 'error', 'data': error })
    }
};

let deleteUser = async (req, res) => {
    try {
        if (await _checkUserIdExist(req.body.user_id)) {
            var removed = await UserCollection.deleteOne({ '_id': req.body.user_id })
            res.json(200, removed);
        } else {
            res.json(400, { 'status': 'error', 'data': "User Not Found" })
        }
    } catch (error) {
        console.log(error);
        res.json(400).json({ 'status': 'error', 'data': error })
    }
}

let get_all_users = async (req, res) => {
    try {
        let users = await UserCollection.find();
        if (users.length) {
            res.status(200).json(users)
        } else {
            console.log("user not found")
            res.status(200).json([])
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ 'status': 'error', 'data': error })
    }
};

let update_user_location = async (req, res) => {
    try {
        if (req.body.user_id && req.body.latitude && req.body.longitude) {
            let pilotUpdates = await UserCollection.updateOne(
                { "_id": req.body.user_id },
                {
                    $set: {
                        'latitude': req.body.latitude,
                        'longitude': req.body.longitude,
                        'location_last_update': new Date()
                    }
                },
                { new: true }
            );
            res.status(200).json("updated")
        } else {
            res.status(400).json({ 'status': 'error', 'data': "Required fileds are missing" })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'status': 'error', 'data': error })
    }

}


let _checkUserExist = async user_mobile => {
    try {
        var check = await UserCollection.find({ user_mobile: user_mobile });
        return check.length > 0;
    } catch (error) {
        throw error;
    }
};

let _checkUserIdExist = async id => {
    try {
        var check = await UserCollection.find({ _id: id });
        return check.length > 0;
    } catch (error) {
        throw error;
    }
};

let create_admin = async () => {
    try {
        let admin = await UserCollection.findOne({ user_mobile: 123456 });
        if (admin) {
            console.log("Admin already found");
        } else {
            let adminPassowrd = "admin123"
            let hash = await bcrypt.hash(adminPassowrd, saltRounds);
            console.log(hash);

            let adminUserData = {
                'user_name': "Admin",
                'user_mobile':123456,
                'user_email': "admin@admin.com",
                'password': hash,
                'access_type': 'admin'
            }

            var models = new UserCollection(adminUserData);
            var inserted = await models.save();
            console.log("Admin added", inserted)
        }
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    create_user: create_user,
    get_all_users: get_all_users,
    deleteUser: deleteUser,
    update_user_location:update_user_location,
    create_admin:create_admin
}