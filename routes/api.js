const express = require('express');
const router = express.Router();
const User = require('../models/user');

//api routes
const highscoreRouter = require('./highscore');
router.use('/games/highscores', highscoreRouter);

router.get('/users/data_secret', async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username secret');
            res.send({
                username: user.username,
                secret: user.secret
            });
        } else {
            // The user is not logged in
            res.status(204).send('na');
        }
    } catch {
        res.status(204).send('na');
    }
});

router.get('/users/data_username', async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username');
            res.send({
                username: user.username
            });
        } else {
            // The user is not logged in
            res.status(204).send('na');
        }
    } catch {
        res.status(204).send('na');
    }
});

router.get('/users/data_loggedIn', async function(req, res) {
    // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    // res.header('Access-Control-Allow-Credentials', true);

/*
var allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:5500', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  */

    try {
        if (req.isAuthenticated()) {
            return res.send({
                loggedId: true
            });
        } else {
            // The user is not logged in
            return res.send({
                loggedId: false
            });
        }
    } catch {
        return res.send({
            loggedId: false
        });
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
        const user = await User.findOne({username: new RegExp("^" + req.params.name + "$", "i")}, 'username profileImage profileImageType');
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

// router.get('/test_user_data', async function(req, res) {
//     try {
//         const user = await User.findOne({username:'Test'}, 'username secret');
//         res.send({
//             username: user.username,
//             secret: user.secret
//         });
//     } catch {
//         res.send({
//             username: "Test",
//             secret: ""
//         });
//     }
// });

module.exports = router;