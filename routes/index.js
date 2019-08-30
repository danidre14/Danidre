const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "home", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('index', vars);
});

module.exports = router;