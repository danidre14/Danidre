const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('news/index', {cPage: "news"});
});

module.exports = router;