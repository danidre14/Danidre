const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "news", searchOptions: req.query};
    vars.title = "News";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    res.render('news/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/news');
})

module.exports = router;