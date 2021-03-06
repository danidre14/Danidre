const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Game = require('../fixtures/game');

router.get('/', async (req, res) => {
    let vars = { cPage: "home", searchOptions: req.query };
    vars.title = "Home";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    const posts = await Post.find({}, 'title name updatedAt createdAt summary image views', { sort: { createdAt: -1 }, limit: 2 });

    vars.posts = posts;
    vars.games = Game.find({ limit: 2 });
    res.render('index', vars);
});

router.get('//*', (req, res) => res.redirect('/'));

module.exports = router;