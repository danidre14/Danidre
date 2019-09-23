const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Highscore = require('../models/highscore');
const hash = require("blueimp-md5");

//get highscore
router.get('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    const highscores = await Highscore.find({}, 'name key sort');

    res.send({highscores: highscores});
});
//add highscore
router.post('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, validateHighScoreName, async (req, res) => {
    //check if highscore exists
    let highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
    if(highscore) return res.send({res: 'Error', msg: 'Highscore already exists'});

    const sortOrder = req.body.highscoreSort ? req.body.highscoreSort : 1;

    //if not, create highscore
    highscore = new Highscore({
        name: req.body.highscoreName,
        sort: sortOrder
    });
    highscore.key = hash(highscore._id);
    await highscore.save();
    res.send({res: 'Success', msg: 'Highscore created'});
});

//edit highscore
router.put('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, validateHighScoreName, async (req, res) => {
    //check if old highscore exists
    let oldHighscore = await Highscore.findOne({name: new RegExp("^" + req.body.oldHighscoreName + "$", "i")});
    if(!oldHighscore) return res.send({res: 'Error', msg: 'Highscore does not exist'});


    //if it does, edit it (only if highscoreName isn't equal to new highscoreName but they may have same name but diff spelling)

    if(oldHighscore.name.toLowerCase() === req.body.highscoreName.toLowerCase() && oldHighscore.name !== req.body.highscoreName) {
        oldHighscore.name = req.body.highscoreName;
        await oldHighscore.save();

        return res.send({res: 'Success', msg: 'Highscore edited'});
    }

    //check if highscore exists
    let highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
    if(highscore) return res.send({res: 'Error', msg: 'Highscore already exists'});

    //if it doesn't, edit it (only if highscoreName isn't equal to new highscoreName)
    if(oldHighscore.name !== req.body.highscoreName) {
        oldHighscore.name = req.body.highscoreName;
        await oldHighscore.save();

        return res.send({res: 'Success', msg: 'Highscore edited'});
    }
    res.send({res: 'Error', msg: 'Highscore not edited'});
});

//delete highscore
router.delete('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    //check if highscore exists
    const highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
    if(!highscore) return res.send({res: 'Error', msg: 'Highscore does not exist'});

    //if it does, remove it
    await highscore.remove();
    res.send({res: 'Success', msg: 'Highscore deleted'});
});

//update sort method
router.put('/highscores_list_sort', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    //check if highscore exists
    let highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
    if(!highscore) return res.send({res: 'Error', msg: 'Highscore does not exists'});

    //if it does, edit it (only if highscoreName isn't equal to new highscoreName)
    highscore.sort *= -1;
    if(highscore.sort > 1 || highscore.sort == 0) highscore.sort = 1;
    else if(highscore.sort < -1) highscore.sort = -1;

    await highscore.save();
    res.send({res: 'Success', msg: 'Sort method changed'});
});

router.use('/*', (req, res) => {
    res.redirect('/about');
})

function validateHighScoreName(req, res, next) {
    let error = false;

    //highscoreName validation
    const highscoreName = req.body.highscoreName;
    let message = "";
    if(highscoreName.length < 3 || highscoreName.length > 15) {
        message += "-Must be 3-15 characters long";
        error = true;
    } else {
        if(highscoreName.charAt(0).match(/^[a-z]+$/ig) === null) {
            message += "-Highscore must start with a letter\n";
            error = true;
        } else if(highscoreName.match(/^[a-z][a-z\d]+$/ig) === null) {
            message += "-Symbols/Spaces not allowed";
            error = true;
        } 
    }

    if (error)
        return res.send({res: 'Error', msg: message});

    next();
}

function checkAuthenticatedAccess(req, res, next) {
    if(!req.isAuthenticated()) { //unauthenticated user
        return res.redirect('/');
    }
    next();
}

async function checkIsAdmin(req, res, next) {
    const isAdmin = req.user.username.toLowerCase() === process.env.ADMIN_NAME;

    if(!isAdmin) { //unauthorized user    
        return res.redirect(`/`);
    }
    next();
}


module.exports = router;