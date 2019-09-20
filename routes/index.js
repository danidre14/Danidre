const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "home", searchOptions: req.query};
    vars.title = "Home";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('index', vars);
});

router.get('//*', (req, res) => res.redirect('/'));

module.exports = router;