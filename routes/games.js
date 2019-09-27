const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "games", searchOptions: req.query};
    vars.title = "Games";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }

    vars.games = gamesList();

    res.render('games/index', vars);
});

router.get('/:gameName', async (req, res) => {
    let vars = {cPage: "games", searchOptions: req.query};
    if(req.isAuthenticated()) {
        try {
        const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
        vars.user = user;
        } catch {}
    }

    const gameName = req.params.gameName.toLowerCase();
    const game = gamesInformation(gameName);


    if(!game) {
        vars.title = "Games";
        vars.description = "Missing game. This game does not exist!";
        vars.blCode = "game_not_found";
        res.render('misc/blank', vars);
    } else {
        vars.game = game;
        vars.title = game.title;
        res.render('games/show', vars);
    }
})

const gamesList = function() {
    const gameList = [
        /*{
            title: "My First Game",
            minidesc: "The first game of mines.",
            image: "FirstGame/Icon_Rakan.png",
            url: "/games/my_first_game"
        },*/
        {
            title: "Quiz Game",
            minidesc: "Test your intellect with 10 simple questions.",
            image: "https://cdn.pixabay.com/photo/2018/08/31/11/17/quiz-3644414_960_720.png",
            url: "/games/quiz_game"
        },
        {
            title: "Newgrounds Games",
            minidesc: "Play my other games at Newgrounds.",
            image: "/games/newgroundsimg.png", // /games/[src.png]
            url: "https://danidre14.newgrounds.com/games"
        }
    ]
    return gameList;
}

const gamesInformation = function(gameName) {
    const gameLibrary = {
        /*my_first_game: {
            scripts: ["FirstGame/firstGame.js"], // /games/[src.js]
            title: "My First Game",
            description: `The first game ever in a world of time and space with a humanitarian face Lorem Ipsum Diplum BloopDomTomLum A Dumbamom.
            Hope you enhoy.`,
            minidesc: `The first game of mines.`,
            image: "FirstGame/Icon_Rakan.png" // /games/[src.png]
        }*/
        quiz_game: {
            scripts: ["QuizGame/guizGame.js"],
            title: "Quiz Game",
            description: `My first game on this website.
            
            Answer 10 simple questions! :D`,
            minidesc: `Test your intellect with 10 simple questions.`,
            image: "https://cdn.pixabay.com/photo/2018/08/31/11/17/quiz-3644414_960_720.png"
        }
    }
    return gameLibrary[gameName];
}

module.exports = router;