const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Secret Page";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username:  new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    vars.description = "Super secrety secret page. I wonder what it holds!";
    res.render('misc/blank', vars);
});

router.get('/polyTT', async (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Poly Time Table";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('misc/polyTimeTableMaker', vars);
});

router.get('/surveyMaker', async (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Survey Maker";
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
        vars.user = user;
    }
    res.render('misc/surveyMaker', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;