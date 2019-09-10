const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/user_data', async function(req, res) {
    try {
        if (req.isAuthenticated()) {
            const user = await User.findOne({username:req.user.username}, 'username secret');
            res.send({
                username: user.username,
                secret: user.secret
            });
        } else {
            // The user is not logged in
            res.status(204).send('na');
        }
    } catch {
        
    }
});

router.get('/test_user_data', async function(req, res) {
    try {
        const user = await User.findOne({username:'Test'}, 'username secret');
        res.send({
            username: user.username,
            secret: user.secret
        });
    } catch {
        
    }
});

module.exports = router;