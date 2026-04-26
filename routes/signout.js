const express = require('express');
const router = express.Router();

router.get(/(.*)/, (req, res) => {
    res.redirect(req.header('Referer') || '/');
});

router.delete('/', checkAuthenticated, (req, res, next) => {
    req.logOut(function(err) {
        if (err) {
            console.error('Logout error', err);
            return next(err);
        }
        res.redirect(req.header('Referer') || '/');
    });
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect(req.header('Referer') || '/');
}

module.exports = router;