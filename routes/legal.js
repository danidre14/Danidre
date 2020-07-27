const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/privacy', async (req, res) => {
    let vars = { cPage: "legal", searchOptions: req.query };
    vars.title = "Legal";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    res.render('legal/privacy', vars);
});

router.get('/tos', async (req, res) => {
    let vars = { cPage: "legal", searchOptions: req.query };
    vars.title = "Legal";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    res.render('legal/tos', vars);
});

// router.use('/*', (req, res) => {
//     res.redirect('/legal');
// });

module.exports = router;