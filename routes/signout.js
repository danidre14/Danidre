const express = require('express');
const router = express.Router();

router.get('/*', (req, res) => {
    res.redirect('/');
});

router.delete('/', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/');
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

module.exports = router;