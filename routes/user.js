const express = require('express');
const router = express.Router();
const User = require('../models/user');
const paginatedResults = require('../utils/paginatedResults');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', checkIfLoggedIn, paginatedResults(User, ['bio', 'username'], 'username lastSeen createdAt updatedAt profileImage profileImageType', {lastSeen: -1, updatedAt: -1, createdAt: -1}), async (req, res) => {
    let vars = {cPage: "u", searchOptions: req.query};
    vars.title = "Users";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username lastSeen profileImage profileImageType');
        vars.user = user;
    }

    vars.paginatedResults = res.paginatedResults;
    res.render('user/index', vars);
});

router.get('/:name', async (req, res) => { //add authentication check
    const profile = await User.findOne({username:new RegExp("^" + req.params.name + "$", "i")}, 'username lastSeen firstName lastName bio roles updatedAt profileImage profileImageType').populate('roles', 'name');
    if(!profile) {
        if(!req.isAuthenticated()) {
            return res.redirect('/');
        }
        return res.redirect('/u');
    }

    let vars = {cPage: "u", searchOptions: req.query, profile: profile};
    vars.title = `${profile.username}'s Profile`;
    if(req.isAuthenticated()) {
        const user = await User.findOne({username:new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('user/profile', vars);
});

router.get('/:name/edit', checkAuthenticatedAccess, checkAuthorizedAccess, async (req, res) => {
    try {
        const profile = await User.findOne({username: new RegExp("^" + req.params.name + "$", "i")}, 'username firstName lastName bio roles createdAt updatedAt profileImage profileImageType').populate('roles', 'name');
        if(!profile) {
            return res.redirect('/u');
        }
        let vars = {cPage: "u", searchOptions: req.query, profile: profile};
        vars.title = "Edit Profile";
        if(req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;//because from here its authenticated
        }
        
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
            bio: req.body.bio.trim(),
            profileImage: req.body.profileImage
        }
        let hasChanged = false;
        let user = await User.findOne({username: new RegExp("^" + req.params.name + "$", "i")});
        if(user.firstName !== updates.firstName) {
            if(updates.firstName != null && updates.firstName !== '') {
                user.firstName = updates.firstName;
                hasChanged = true;
            }
        }
        if(user.lastName !== updates.lastName) {
            if(updates.lastName != null && updates.lastName !== '') {
                user.lastName = updates.lastName;
                hasChanged = true;
            }
        }
        if(user.bio !== updates.bio) {
            if(updates.bio != null && updates.bio !== '') {
                user.bio = updates.bio;
                hasChanged = true;
            }
        }
        if(user.profileImage !== updates.profileImage) {
            if(updates.profileImage != null && updates.profileImage !== '') {
                saveProfileImage(user, updates.profileImage);
                hasChanged = true;
            }
        }
        if(hasChanged) {
            user.updatedAt = Date.now() || user.updatedAt;
            await user.save();
        }
        res.redirect(`/u/${user.username}`);
    } catch (err) {
        console.log("Message:", err.message);
        res.redirect(`/u/${user.username}`);
    }
});

//survey stuff rn
router.post('/:name/update', 
(req, res, next) => {
    if(!req.isAuthenticated()) { //unauthenticated user
        req.flash('outsert', {message: 'Access denied. Sign in to edit your account.', note: true});
        return res.send('Unauthenticated user');
    }
    next();
}, (req, res, next) => {
    if(req.user.username !== req.params.name) { //unauthorized user    
        req.flash('outsert', {message: `Access denied. Cannot edit someone else's account.`, note: true});            return res.send('Unauthorized user');
    }
    next();
},
async (req, res) => {
    if(req.body.target === 'surveyMaker') {
        let user = await User.findOne({username: new RegExp("^" + req.params.name + "$", "i")}, 'username secret');
        user.secret.surveyMaker[req.body.key] = req.body.value;
        user.markModified('secret');
        await user.save();
        res.send('Successful');
    }
});


router.delete('/:name/update', 
(req, res, next) => {
    if(!req.isAuthenticated()) { //unauthenticated user
        req.flash('outsert', {message: 'Access denied. Sign in to edit your account.', note: true});
        return res.send('Unauthenticated user');
    }
    next();
}, (req, res, next) => {
    if(req.user.username !== req.params.name) { //unauthorized user    
        req.flash('outsert', {message: `Access denied. Cannot edit someone else's account.`, note: true});            return res.send('Unauthorized user');
    }
    next();
},
async (req, res) => {
    if(req.body.target === 'surveyMaker') {
        let user = await User.findOne({username: new RegExp("^" + req.params.name + "$", "i")}, 'username secret');
        user.secret.surveyMaker[req.body.key] = undefined;
        user.markModified('secret');
        await user.save();
        res.send('Successfully deleted mf');
    }
});

router.use('/*', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('/u');
});


function checkAuthenticatedAccess(req, res, next) {
    if(!req.isAuthenticated()) { //unauthenticated user
        req.flash('outsert', {message: 'Access denied. Sign in to edit your account.', note: true});
        return res.redirect('/');
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
    res.redirect('/');
}

function saveProfileImage(user, profileImageEncoded) {
    if (profileImageEncoded == null || profileImageEncoded == '') return;
    const profileImage = JSON.parse(profileImageEncoded);
    if (profileImage != null && imageMimeTypes.includes(profileImage.type)) {
        user.profileImage = new Buffer.from(profileImage.data, 'base64');
        user.profileImageType = profileImage.type;
    }
}

module.exports = router;