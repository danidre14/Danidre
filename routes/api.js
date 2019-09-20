const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/user_data', async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username secret');
            res.send({
                username: user.username,
                secret: user.secret
            });
        } else {
            // The user is not logged in
            res.status(204).send('na');
        }
    } catch {
        
    }
});

//get users list for on users page
// routerr.get('/users_list', async (req, res) => {
// /*
//     axios.get('/api/users_list', {
//         params: {
//             currPage: currPage,
//             limit: limit
//         }
//     });
// */

//     try {
//         const currPage = req.query.currPage;
//         const limit = req.query.limit;
//         const count = await User.find().estimatedDocumentCount();
//         const users = await User.find({}, 'username lastSeen createdAt updatedAt profileImage profileImageType', {sort: {lastSeen: -1, updatedAt: -1, createdAt: -1}, });
//     } catch {

//     }
// });

//avatars for profile pictures
router.get('/uploads/avatars/:name', async (req, res) => {
    try {
        const user = await User.findOne({username:  new RegExp(req.params.name, "i")}, 'username profileImage profileImageType');
        if(!user) 
            res.send({
                path: '../images/UsersIcon.png'
            });
        if (user.profileImage != null && user.profileImageType != null) {
            res.send({
                path: `data:${user.profileImageType};charset=utf-8;base64,${user.profileImage.toString('base64')}`
            });
        } else {
            res.send({
                path: '../images/UsersIcon.png'
            });
        }
    } catch {
        res.send({
            path: '../images/UsersIcon.png'
        });
    }
})

router.get('/test_user_data', async function(req, res) {
    try {
        const user = await User.findOne({username:'Test'}, 'username secret');
        res.send({
            username: user.username,
            secret: user.secret
        });
    } catch {
        res.send({
            username: "Test",
            secret: ""
        });
    }
});

module.exports = router;