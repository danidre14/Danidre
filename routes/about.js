const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "about", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('about/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/about');
})

module.exports = router;