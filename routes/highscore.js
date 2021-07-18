const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Highscore = require('../models/highscore');
const hash = require("blueimp-md5");
const arrayFunc = require('../utils/arrayFunc');

//get highscore
router.get('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    console.log("got here in highscores")
    try {
        const highscores = await Highscore.find({}, 'name key order');

        res.send({highscores: highscores});
    } catch (e) {
        console.warn("Highscores list err:", e)
        res.status(204).send('na');
    }
});
//add highscore
router.post('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, validateHighScoreName, async (req, res) => {
    try {
        //check if highscore exists
        let highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
        if(highscore) return res.send({res: 'Error', msg: 'Highscore already exists'});

        const order = req.body.highscoreOrder ? req.body.highscoreOrder : 1;

        //if not, create highscore
        highscore = new Highscore({
            name: req.body.highscoreName,
            order: order
        });
        highscore.key = hash(highscore._id);
        await highscore.save();
        res.send({res: 'Success', msg: 'Highscore created'});
    } catch {
        res.send({res: 'Error', msg: 'Error Occurred.'});
    }
});

//edit highscore
router.put('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, validateHighScoreName, async (req, res) => {
    try {
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
    } catch {
        res.send({res: 'Error', msg: 'Error Occurred.'});
    }
});

//delete highscore
router.delete('/highscores_list', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    try {
        if(await bcrypt.compare(req.body.passkey, process.env.ADMIN_KEY)) {
            //check if highscore exists
            const highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
            if(!highscore) return res.send({res: 'Error', msg: 'Highscore does not exist'});

            //if it does, remove it
            await highscore.remove();
            res.send({res: 'Success', msg: 'Highscore deleted'});
        } else {
            res.send({res: 'Error', msg: 'Access Denied.'})
        }
    } catch (e) {
        res.send({res: 'Error', msg: 'Error Occurred.'});
        console.log("Message deleting highscore:", e.message);
    }
});

//update order method
router.put('/highscores_list_order', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    try {
        //check if highscore exists
        let highscore = await Highscore.findOne({name: new RegExp("^" + req.body.highscoreName + "$", "i")});
        if(!highscore) return res.send({res: 'Error', msg: 'Highscore does not exists'});

        
        highscore.order *= -1;
        if(highscore.order > 1 || highscore.order == 0) highscore.order = 1;
        else if(highscore.order < -1) highscore.order = -1;

        await highscore.save();
        res.send({res: 'Success', msg: 'Order method changed'});
    } catch {
        res.send({res: 'Error', msg: 'Error Occurred.'});
    }
});


//====================API ROUTES===========================

// connect
router.post("/connect", async (req, res) => {
    try {
        // -‎verify correct key
        const key = req.body.key;
        if(!key || typeof key !== "string") {
            return res.send({res: 'Error', msg: 'Highscore key missing.'});
        }
        let highscore = await Highscore.findOne({key: key}, 'name');
        if(!highscore) {
            return res.send({res: 'Error', msg: 'Highscore not found.'});
        }
        let userName = '';
        if (req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username');
            userName = user.username;
        }
        // -‎send defaultName
        res.send({res: 'Success', msg: 'Connected.', name: highscore.name, userName: userName});

    } catch {
        return res.send({res: 'Error', msg: `Can't connect to highscore.`});
    }
});

// postScore
router.post("/post_score", async (req, res) => {
    try {
        // -verify logged in
        if(!req.isAuthenticated()) { //unauthenticated user
            return res.send({res: 'Error', msg: `User not logged in.`});
        }

        // -‎verify correct key
        const key = req.body.key;
        if(!key || typeof key !== "string") {
            return res.send({res: 'Error', msg: 'Highscore key missing.'});
        }
        let highscore = await Highscore.findOne({key: key}, 'name scores order');
        if(!highscore) {
            return res.send({res: 'Error', msg: 'Highscore not found.'});
        }

        // -validate correct user
        const userName = req.body.userName;
        if(userName.toLowerCase() !== req.user.username.toLowerCase()) {
            return res.send({res: 'Error', msg: 'Invalid user.'});
        }

        const order = highscore.order;

        // -‎parseInt(score)
        let score = req.body.score;
        if(score === undefined || score === null) {
            return res.send({res: 'Error', msg: 'Invalid score.'});
        }
        if(score == parseInt(score)) {
            score = parseInt(score);
        } else {
            return res.send({res: 'Error', msg: 'Invalid score.'});
        }

        // -‎check if score exists
        //TODO BE CONTINUED
        // --look for user
        const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username');
        if(!user) {
            return res.send({res: 'Error', msg: 'No user found.'});
        }
        // --look for score (by seeing if user exists)
        const scoreExists = highscore.scores.some(obj => obj.userID.equals(user._id));
        // --if not exist, post score ...
        if(!scoreExists) {
            highscore.scores.push({userID: user._id, score: score, obtainedAt: Date.now()});

                highscore.scores = sortHighscores(highscore.scores, order);

            highscore.markModified('scores');
            await highscore.save();
            return res.send({res: 'Success', msg: `Score posted.`});
        } else {
        // --‎if does exist, check if score * sort > currentScore * sort
            //find indexOfUser
            const scoreExistsAt = userIndexAt(highscore.scores, user._id);
            if(scoreExistsAt === -1) {
                highscore.scores.push({userID: user._id, score: score, obtainedAt: Date.now()});

                highscore.scores = sortHighscores(highscore.scores, order);

                highscore.markModified('scores');
                await highscore.save();
                return res.send({res: 'Success', msg: `Score posted.`});
            }
            const userScore = highscore.scores[scoreExistsAt].score;

            //check if score bigger
            if(score * order > userScore * order) {
                // ---‎if does, post score to scores (userID, score, obtainedat)
                // ---find indexof current, change Val, resort
                highscore.scores[scoreExistsAt].score = score;
                highscore.scores[scoreExistsAt].obtainedAt = Date.now();

                highscore.scores = sortHighscores(highscore.scores, order);

                highscore.markModified('scores');
                await highscore.save();
                return res.send({res: 'Success', msg: `Score posted.`});
            }
            return res.send({res: 'Success', msg: `Not new highscore.`});
        }

    } catch (e) {
        console.trace('The problem posting is: ', e.message)
        return res.send({res: 'Error', msg: `Can't post highscore.`});
    }
});

// getScores
// -get optionalOrder parsedInt default 1 (nah)
router.post("/get_scores", async (req, res) => {
    try {
        // -verify correct key
        const key = req.body.key;
        if(!key || typeof key !== "string") {
            return res.send({res: 'Error', msg: 'Highscore key missing.'});
        }
        let highscore = await Highscore.findOne({key: key}, 'scores order');
        if(!highscore) {
            return res.send({res: 'Error', msg: 'Highscore not found.'});
        }
        highscore.scores = sortHighscores(highscore.scores, highscore.order);

        // -‎get required page and nav dir, or use page1
        let page = parseInt(req.body.page);
        if(!page) page = 1;
        const nav = req.body.nav;
        if(nav === "prev") {
            page = (page - 1);
        } else if(nav === "next") {
            page = (page + 1);
        }

        // -‎get optionalSort (strings
        let sort = req.body.sort;
        if(sort === "name") {// --name: userID
            sort = "userID";
        } else if(sort === "username") {// --date: obtainedAt
            sort = "name";
        } else {// --default is score
            sort = "score";
        }


        const limit = 10;
        const count = highscore.scores.length;
        let maxPages = Math.ceil(count / limit);
        if(maxPages < 1) maxPages = 1;
        if(page < 1) page = 1;
        if(page > maxPages) page = maxPages;

        const skip = (page - 1) * limit;

        const scores = arrayFunc.skipLimitArr(highscore.scores, skip, limit);

        for(const i in scores) {
            scores[i] = await formatHighscoreUser(scores[i]);
        }

        //set user score (if logged in)
        let userScore = {loggedIn:false, hasScore:false};
        // -verify logged in
        if(!req.isAuthenticated()) { //unauthenticated user
            userScore = {loggedIn:false, hasScore:false};
        } else {
            // --look for user
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username');
            if(!user) {
                userScore = {loggedIn:false, hasScore:false};
            } else {
                //find indexOfUser
                const scoreExistsAt = userIndexAt(highscore.scores, user._id);
                if(scoreExistsAt === -1) {
                    userScore = {loggedIn:true, hasScore:false};
                } else {
                    userScore = highscore.scores[scoreExistsAt];
                    userScore = await formatHighscoreUser(userScore);
                    userScore.loggedIn = true;
                    userScore.hasScore = true;
                    userScore.rank = scoreExistsAt + 1;
                }
            }
        }

        // -send scores by sort method and order (TODO)
        // -‎send place of user by indexOf
        // -‎send page number
        // -‎send maxpage
        return res.send({res: 'Success', msg: 'Got highscores',
            scores: {
                list: scores,
                user: userScore,
                limit: limit
            },
            page: page,
            maxPages: maxPages
        });
    } catch (e) {
        console.trace('The problem getting is: ', e.message)
        return res.send({res: 'Error', msg: `Can't get highscores.`});
    }
});

const formatHighscoreUser = async function(arr) {
    try {
        const user = await User.findOne({_id: arr.userID}, 'username');
        return {
            name: user.username || "Anonymous",
            score: arr.score,
            date: arr.obtainedAt
        }
    } catch {
        return {
            name: "Anonymous",
            score: arr.score,
            date: arr.obtainedAt
        }
    }
}

const userIndexAt = function(array, value) { 
    for (var i = 0; i < array.length; i += 1) { 
        if (array[i].userID.equals(value)) { 
            return i; 
        } 
    } 
    return -1; 
} 

const sortHighscores = function(array, order) {
    const compareScore = function(a, b) {
        const scoreA = a.score;
        const scoreB = b.score;
        
        let comparison = 0;
        if (scoreA > scoreB) {
            comparison = -1;
        } else if (scoreA < scoreB) {
            comparison = 1;
        }
        return comparison * order;
    }

    return array.sort(compareScore);
}

//=========================================================

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