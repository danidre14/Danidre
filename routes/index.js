const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "home", searchOptions: req.query};
    vars.title = "Home";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('index', vars);
});

router.get('//*', (req, res) => res.redirect('/'));

module.exports = router;