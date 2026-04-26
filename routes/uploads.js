const express = require('express');
const router = express.Router();
const fs = require('fs');
const Image = require('../models/image');
const imageCache = require('../utils/imageCache');

router.get('/images/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const cached = imageCache.getCachedInfo(slug);
        if (cached && cached.path) {
            try {
                if (fs.existsSync(cached.path)) {
                    res.setHeader('Content-Type', cached.contentType || 'application/octet-stream');
                    const stream = fs.createReadStream(cached.path);
                    return stream.pipe(res);
                }
            } catch (e) { }
        }

        if (imageCache.getImagesCached()) {
            return res.status(404).send('Not found');
        }

        // cache not ready, fallback to db
        const img = await Image.findOne({ slug }, 'contentType data');
        if (!img) return res.status(404).send('Not found');

        // write to cache for future requests
        await imageCache.writeImageToCache(img);

        res.setHeader('Content-Type', img.contentType || 'application/octet-stream');
        return res.send(img.data);

    } catch (e) {
        console.error('Image serve error', e && e.message);
        res.status(500).send('Error');
    }
});

module.exports = router;
