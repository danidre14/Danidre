const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Secret Page";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    vars.description = "Super secrety secret page. I wonder what it holds!";
    res.render('misc/blank', vars);
});

router.get('/polyTT', (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Poly Time Table";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('misc/polyTimeTableMaker', vars);
});

router.get('/surveyMaker', (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Survey Maker";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('misc/surveyMaker', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/');
})

module.exports = router;