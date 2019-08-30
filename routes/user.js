const express = require('express');
const router = express.Router();
const User = require('../models/user')
// <%= user.username user.createdAt user.email %>
router.get('/', checkIfLoggedIn, async (req, res) => {
    let vars = {cPage: "u", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    const user = await User.find({}, 'username', {sort: {createdAt: -1}});
    vars.users = user;
    res.render('user/index', vars);
});

router.get('/:name', async (req, res) => { //add authentication check
    const user = await User.findOne({username:req.params.name});
    if(!user) {
        if(!req.isAuthenticated()) {
            return res.redirect('back');
        }
        return res.redirect('/u');
    }

    let vars = {cPage: "u", searchOptions: req.query, profile: {
        username: user.username,
        roles: user.roles || [],
        createdAt: user.createdAt,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
    }};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('user/profile', vars);
});

router.get('/:name/edit', async (req, res) => {
    if(!req.isAuthenticated()) { //unauthenticated user
        return res.redirect('back');
    }
    if(req.user.username !== req.params.name) { //unauthorized user
        return res.redirect('back');
    }

    const user = await User.findOne({username:req.params.name});
    if(!user) {
        return res.redirect('/u');
    }
    let vars = {cPage: "u", searchOptions: req.query, profile: {
        username: user.username,
        roles: user.roles || [],
        createdAt: user.createdAt,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
    }};
    vars.username = req.user.username; //because from here its authenticated
    
    res.render('user/edit', vars);
});

router.use('/*', (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect('back');
    }
    res.redirect('/u');
});



function checkIfLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('outsert', {message: 'Sign In to view the Users Page', note: true});
    res.redirect('back');
}

module.exports = router;