const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "contact", searchOptions: req.query};
    vars.title = "Contact";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('contact/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/contact');
})

module.exports = router;