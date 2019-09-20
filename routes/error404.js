const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.use(async (req, res, next) => {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        //res.send('html not found');
        let vars = {cPage: "", searchOptions: req.query};
        vars.url = req.url;
        vars.title = "Page Not Found";
        if(req.isAuthenticated()) {
            const user = await User.findOne({username: new RegExp(req.user.username, "i")}, 'username profileImage profileImageType');
            vars.user = user;
        }
        vars.bounceLink = req.header('Referer') || '/';
        // req.flash('bounce', {message: req.header('Referer') || '/'});
        res.render('misc/error404', vars);
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        //res.send('json not found');
        res.send({ error: 'Not-found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not=found');
})

module.exports = router;