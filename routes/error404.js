const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        //res.send('html not found');
        let vars = {cPage: "", searchOptions: req.query};
        vars.url = req.url;
        if(req.isAuthenticated()) {
            vars.username = req.user.username;
        }
        res.render('partials/error404', vars);
        return;
    }
    // respond with json
    if (req.accepts('json')) {
        //res.send('json not found');
        res.send({ error: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
})

module.exports = router;