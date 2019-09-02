const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', checkIfLoggedIn, async (req, res) => {
    let vars = {cPage: "u", searchOptions: req.query};
    vars.title = "Users";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    const user = await User.find({}, 'username', {sort: {createdAt: -1}});
    vars.users = user;
    res.render('user/index', vars);
});

router.get('/:name', async (req, res) => { //add authentication check
    const user = await User.findOne({username:req.params.name}, 'username firstName lastName bio roles createdAt updatedAt');
    if(!user) {
        if(!req.isAuthenticated()) {
            return res.redirect('/');
        }
        return res.redirect('/u');
    }

    let vars = {cPage: "u", searchOptions: req.query, profile: user};
    vars.title = `${user.username}'s Profile`;
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('user/profile', vars);
});

router.get('/:name/edit', checkAuthenticatedAccess, checkAuthorizedAccess, async (req, res) => {
    try {
        const user = await User.findOne({username:req.params.name}, 'username firstName lastName bio roles createdAt updatedAt');
        if(!user) {
            return res.redirect('/u');
        }
        let vars = {cPage: "u", searchOptions: req.query, profile: user};
        vars.title = "Edit Profile";
        vars.username = req.user.username; //because from here its authenticated
        
        res.render('user/edit', vars);
    } catch {        
        req.flash('outsert', {message: 'Unable to edit page.', note: true, error: true});
        res.redirect(`/u/${req.user.username}`);
    }
});

//Update Profile
router.put('/:name', checkAuthenticatedAccess, checkAuthorizedAccess, async (req, res) => {
    try {
        const updates = {
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            bio: req.body.bio.trim()
        }
        let hasChanged = false;
        let user = await User.findOne({username: req.params.name});
        if(user.firstName !== updates.firstName) {
            user.firstName = updates.firstName;
            hasChanged = true;
        }
        if(user.lastName !== updates.lastName) {
            user.lastName = updates.lastName;
            hasChanged = true;
        }
        if(user.bio !== updates.bio) {
            user.bio = updates.bio;
            hasChanged = true;
        }
        if(hasChanged) {
            user.updatedAt = Date.now() || user.updatedAt;
            await user.save();
        }
        res.redirect(`/u/${user.username}`);
    } catch {
        console.log(err);
        res.redirect(`/u/${user.username}`);
    }
});

router.use('/*', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('back');
    }
    res.redirect('/u');
});



function checkAuthenticatedAccess(req, res, next) {
    if(!req.isAuthenticated()) { //unauthenticated user
        req.flash('outsert', {message: 'Access denied. Sign in to edit your account.', note: true});
        return res.redirect('back');
    }
    next();
}

function checkAuthorizedAccess(req, res, next) {
    if(req.user.username !== req.params.name) { //unauthorized user    
        req.flash('outsert', {message: `Access denied. Cannot edit someone else's account.`, note: true});
        return res.redirect(`/u/${req.params.name}`);
    }
    next();
}

function checkIfLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('outsert', {message: 'Sign In to view the Users Page', note: true});
    res.redirect('back');
}

module.exports = router;