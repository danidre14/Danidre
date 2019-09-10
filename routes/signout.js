const express = require('express');
const router = express.Router();

router.get('/*', (req, res) => {
    res.redirect(req.header('Referer') || '/');
});

router.delete('/', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect(req.header('Referer') || '/');
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect(req.header('Referer') || '/');
}

module.exports = router;