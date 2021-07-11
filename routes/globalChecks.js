const express = require('express');
const router = express.Router();
const User = require('../models/user');



router.use(async (req, res, next) => {   //last seen updates
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            user.lastSeen = Date.now();
            await user.save();
        } catch {}
    }
    return next();
});

module.exports = router;