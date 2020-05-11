const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Game = require('../fixtures/game');

router.get('/', async (req, res) => {
    let vars = { cPage: "games", searchOptions: req.query };
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }

    vars.games = Game.find();

    res.render('games/index', vars);
});

router.get('/:gameName', async (req, res) => {
    let vars = { cPage: "games", searchOptions: req.query };
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }

    const gameName = req.params.gameName.toLowerCase();
    const game = Game.findOne(gameName);


    if (!game) {
        vars.title = "Games";
        vars.description = "Missing game. This game does not exist!";
        vars.blCode = "game_not_found";
        res.render('misc/blank', vars);
    } else {
        vars.games = Game.find({ random: true }).filter(otherGame => otherGame.title !== game.title);
        vars.games.splice(5);
        vars.game = game;
        vars.title = game.title;
        res.render('games/show', vars);
    }
})


module.exports = router;