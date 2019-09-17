const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.use((req, res, next) => {    //redirecting
    if(process.env.NODE_ENV === 'production') {
        const preferredSite = "Heroku"; //or Danidre
        const hosts = {"Heroku":"danidre.com","Danidre":"danidre.herokuapp.com"};
        const redirects = {"Heroku":"https://danidre.herokuapp.com","Danidre":"http://danidre.com"}
        // Don't allow user to hit Heroku now that we have a domain
        const host = req.get('Host');
        if (host === hosts[preferredSite]) {
            return res.redirect(301, redirects[preferredSite] + req.originalUrl);
        }
        // if(preferredSite === "Heroku")
        //     if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        //             // request was via http, so redirect to https
        //             return res.redirect('https://' + hosts[preferredSite] + req.originalUrl);
        //     } else {
        //             // request was via https, so do no special handling
        //             return next();
        //     }
        return next();
    }
    next();
}, async (req, res, next) => {   //last seen updates
    if(req.isAuthenticated()) {
        const user = await User.findOne({username: req.user.username}, 'username profileImage profileImageType');
        user.lastSeen = Date.now();
        await user.save();
    }
    return next();
});

module.exports = router;