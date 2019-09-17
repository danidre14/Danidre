const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "news", searchOptions: req.query};
    vars.title = "News";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: req.user.username}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('news/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/news');
})

module.exports = router;