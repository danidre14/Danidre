const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "about", searchOptions: req.query};
    vars.title = "About";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    res.render('about/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/about');
})

module.exports = router;