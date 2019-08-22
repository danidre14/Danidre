const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        //res.send('html not found');
        res.render('partials/error404', { url: req.url });
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