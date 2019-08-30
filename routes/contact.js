const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "contact", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('contact/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/contact');
})

module.exports = router;