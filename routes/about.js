const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('about/index', {cPage: "about"});
});

module.exports = router;