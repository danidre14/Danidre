const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let vars = {cPage: "news", searchOptions: req.query};
    vars.title = "News";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('news/index', vars);
});

router.use('/*', (req, res) => {
    res.redirect('/news');
})

module.exports = router;