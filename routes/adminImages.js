const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Image = require('../models/image');
const User = require('../models/user');
const imageCache = require('../utils/imageCache');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

function checkAuthenticatedAccess(req, res, next) {
    if (!req.isAuthenticated()) { //unauthenticated user
        return res.redirect('/');
    }
    next();
}

async function checkIsAdmin(req, res, next) {
    const isAdmin = req.user.username.toLowerCase() === process.env.ADMIN_NAME;

    if (!isAdmin) { //unauthorized user    
        return res.redirect(`/`);
    }
    next();
}

function generateSlug() {
    return crypto.randomBytes(6).toString('hex');
}

router.get('/', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    let vars = { cPage: "admin_images", searchOptions: req.query };
    vars.title = "Manage Images";
    try {
        if (req.isAuthenticated()) {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        }
    } catch { }

    const images = await Image.find({}, 'slug filename contentType createdAt', { sort: { createdAt: -1 } });
    vars.images = images;
    vars.outsert = req.flash('outsert');
    res.render('admin/images/index', vars);
});

router.get('/new', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    let vars = { cPage: "admin_images", searchOptions: req.query };
    vars.title = "Upload Image";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    vars.outsert = req.flash('outsert');
    res.render('admin/images/new', vars);
});

router.post('/', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    try {
        const encoded = req.body.image;
        if (!encoded) {
            req.flash('outsert', { message: 'No file uploaded.' });
            return res.redirect('/admin/images/new');
        }

        let fileObj;
        try {
            fileObj = JSON.parse(encoded);
        } catch (e) {
            req.flash('outsert', { message: 'Invalid upload format.' });
            return res.redirect('/admin/images/new');
        }

        if (!fileObj || !fileObj.type || !fileObj.data || !imageMimeTypes.includes(fileObj.type)) {
            req.flash('outsert', { message: 'Only images are allowed.' });
            return res.redirect('/admin/images/new');
        }

        // support data: URI or plain base64 in fileObj.data
        let base64 = fileObj.data;
        if (typeof base64 === 'string' && /^data:/.test(base64)) {
            base64 = base64.split(',')[1] || '';
        }

        const buffer = Buffer.from(base64, 'base64');

        // ensure unique slug
        let slug = generateSlug();
        while (await Image.findOne({ slug })) {
            slug = generateSlug();
        }

        const img = new Image({
            slug,
            filename: fileObj.name || `upload-${slug}`,
            contentType: fileObj.type,
            data: buffer
        });

        await img.save();
        // update cache
        await imageCache.writeImageToCache(img);

        req.flash('outsert', { message: 'Image uploaded.' });
        res.redirect('/admin/images');
    } catch (e) {
        console.error('Upload error', e && e.message);
        req.flash('outsert', { message: 'Upload failed.' });
        res.redirect('/admin/images');
    }
});

router.post('/delete', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    try {
        const passkey = req.body.passkey;
        if (!passkey) {
            req.flash('outsert', { message: 'Passkey required.' });
            return res.redirect('/admin/images');
        }

        const match = await bcrypt.compare(passkey, process.env.ADMIN_KEY);
        if (!match) {
            console.warn('Admin delete failed: invalid passkey for user', req.user && req.user.username);
            req.flash('outsert', { message: 'Access Denied.' });
            return res.redirect('/admin/images');
        }

        const slug = req.body.slug;
        const img = await Image.findOne({ slug });
        if (!img) {
            req.flash('outsert', { message: 'Image not found.' });
            return res.redirect('/admin/images');
        }

        await Image.deleteOne({ slug });
        await imageCache.removeImageFromCache(slug);
        req.flash('outsert', { message: 'Image deleted.' });
        return res.redirect('/admin/images');
    } catch (e) {
        console.error('Delete error', e && e.message);
        req.flash('outsert', { message: 'Error deleting image.' });
        return res.redirect('/admin/images');
    }
});

router.use(/(.*)/, (req, res) => {
    res.redirect('/admin/images');
});

module.exports = router;
