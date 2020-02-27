const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');

router.get('/', async (req, res) => {
    let vars = { cPage: "posts", searchOptions: req.query };
    vars.title = "Posts";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    const posts = await Post.find({}, 'title name updatedAt createdAt summary image views', { sort: { createdAt: -1 } });

    vars.posts = posts;
    res.render('posts/index', vars);
});

router.post('/', checkAuthenticatedAccess, checkIsAdmin, validatePost, async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const name = req.body.name;
    const code = req.body.code;
    const summary = req.body.summary || '';
    const image = req.body.image || '';
    try {
        //make sure code is unique
        const codeExists = await Post.findOne({ code: new RegExp("^" + code + "$", "i") }, 'code');
        if (codeExists) {
            return res.send({ res: 'Error', msg: 'Code already exists.' });
        }
        //make sure name is unique
        const nameExists = await Post.findOne({ name: new RegExp("^" + name + "$", "i") }, 'name');
        if (nameExists) {
            return res.send({ res: 'Error', msg: 'Name already exists.' });
        }
        const post = new Post({
            title: title,
            content: content,
            name: name.toLowerCase(),
            code: code,
        });
        if (summary.trim() !== '') post.summary = summary;
        if (image.trim() !== '') post.image = image;
        await post.save();
        return res.send({ res: 'Success', msg: 'Post successfully created!' });
    } catch (e) {
        console.log('Error creating post:', e.message);
        return res.send({ res: 'Error', msg: 'Error Occurred.' });
    }
});

router.put('/', checkAuthenticatedAccess, checkIsAdmin, validatePost, async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const name = req.body.name;
    const code = req.body.code;
    const summary = req.body.summary || '';
    const image = req.body.image || '';
    try {
        //make sure code exists (find post by code)
        const post = await Post.findOne({ code: new RegExp("^" + code + "$", "i") }, 'title content name code updatedAt');
        if (!post) {
            return res.send({ res: 'Error', msg: `Post doesn't exist.` });
        }
        //make sure code and name is same
        if (!post.name === name) {
            return res.send({ res: 'Error', msg: `Post not found.` });
        }
        let hasChanged = false;
        if (post.title !== title) {
            if (title != null && title !== '') {
                post.title = title;
                hasChanged = true;
            }
        }
        if (post.content !== content) {
            if (content != null && content !== '') {
                post.content = content;
                hasChanged = true;
            }
        }
        if (post.summary !== summary) {
            post.summary = summary;
            hasChanged = true;
        }
        if (post.image !== image) {
            post.image = image;
            hasChanged = true;
        }
        if (hasChanged) {
            post.updatedAt = Date.now() || post.updatedAt;
            await post.save();
            return res.send({ res: 'Success', msg: 'Post successfully created!' });
        } else {
            return res.send({ res: 'Message', msg: 'Post unchanged!' });
        }
    } catch (e) {
        console.log('Error creating post:', e.message);
        return res.send({ res: 'Error', msg: 'Error Occurred.' });
    }
});

router.delete('/', checkAuthenticatedAccess, checkIsAdmin, async (req, res) => {
    try {
        if (await bcrypt.compare(req.body.passkey, process.env.ADMIN_KEY)) {
            const name = req.body.name;
            const code = req.body.code;

            try {
                //make sure code exists (find post by code)
                const post = await Post.findOne({ code: new RegExp("^" + code + "$", "i") }, 'name');
                if (!post) {
                    return res.send({ res: 'Error', msg: `Post doesn't exist.` });
                }
                //make sure code and name is same
                if (!post.name === name) {
                    return res.send({ res: 'Error', msg: `Post not found.` });
                }
                await post.remove();
                return res.send({ res: 'Success', msg: `Post deleted.` });
            } catch (e) {
                console.log('Error deleting post 1:', e.message);
                return res.send({ res: 'Error', msg: 'Error Occurred.' });
            }
        } else {
            return res.send({ res: 'Error', msg: 'Access Denied.' })
        }
    } catch (e) {
        console.log("Error deleting post 2:", e.message);
        return res.send({ res: 'Error', msg: 'Error Occurred.' });
    }

});

router.get('/new', async (req, res, next) => {
    if (!req.isAuthenticated()) { //unauthenticated user
        return next();
    }
    const isAdmin = req.user.username.toLowerCase() === process.env.ADMIN_NAME;

    if (!isAdmin) { //unauthorized user    
        return next();
    }

    let vars = { cPage: "posts", searchOptions: req.query };
    vars.title = "Create Post";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }
    res.render('posts/new', vars);
});

router.get('/view/:postName', async (req, res) => {
    let vars = { cPage: "posts", searchOptions: req.query };
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }

    const postName = req.params.postName.toLowerCase();
    const post = await Post.findOne({ name: new RegExp("^" + postName + "$", "i") }, 'title content name updatedAt createdAt summary image views');


    if (!post) {
        vars.title = "Posts";
        vars.description = "Missing post. This post does not exist!";
        vars.blCode = "post_not_found";
        res.render('misc/blank', vars);
    } else {
        if (post.views) post.views++; else post.views = 1;
        await post.save();
        vars.title = post.title;
        vars.post = post;
        res.render('posts/show', vars);
    }
});

router.get('/view/:postName/edit', async (req, res, next) => {
    if (!req.isAuthenticated()) { //unauthenticated user
        return next();
    }
    const isAdmin = req.user.username.toLowerCase() === process.env.ADMIN_NAME;

    if (!isAdmin) { //unauthorized user    
        return next();
    }

    let vars = { cPage: "posts", searchOptions: req.query };
    vars.title = "Edit Post";
    if (req.isAuthenticated()) {
        try {
            const user = await User.findOne({ username: new RegExp("^" + req.user.username + "$", "i") }, 'username profileImage profileImageType');
            vars.user = user;
        } catch { }
    }

    const postName = req.params.postName.toLowerCase();
    const post = await Post.findOne({ name: new RegExp("^" + postName + "$", "i") }, 'title content name code summary image');


    if (!post) {
        vars.title = "Posts";
        vars.description = "Missing post. This post does not exist!";
        vars.blCode = "post_not_found";
        res.render('misc/blank', vars);
    } else {
        vars.title = post.title;
        vars.post = post;
        res.render('posts/edit', vars);
    }
});

router.use('/*', (req, res) => {
    res.redirect('/posts');
})

function validatePost(req, res, next) {
    let string;
    const title = req.body.title;
    const content = req.body.content;
    const name = req.body.name;
    const code = req.body.code;

    string = title;
    if (string.length < 5 || string.length > 50) {
        return res.send({ res: 'Error', msg: 'Post title must be 5-50 characters long.' });
    } else {
        if (string.charAt(0).match(/^[a-z]+$/ig) === null) {
            return res.send({ res: 'Error', msg: 'Post title must start with a letter.' });
        }
    }

    string = content;
    if (string.length < 3) {
        return res.send({ res: 'Error', msg: 'Content missing.' });
    }

    string = name;
    if (string.length < 3 || string.length > 30) {
        return res.send({ res: 'Error', msg: 'Url name be 3-30 characters long.' });
    } else {
        if (string.charAt(0).match(/^[a-z]+$/ig) === null) {
            return res.send({ res: 'Error', msg: 'Url name must start with a letter.' });
        } else if (string.match(/^[a-z][a-z\d\_]+$/ig) === null) {
            return res.send({ res: 'Error', msg: 'Symbols/Spaces not allowed.' });
        }
    }

    string = code;
    if (string.length < 2 || string.length > 15) {
        return res.send({ res: 'Error', msg: 'Url code be 2-15 characters long.' });
    } else {
        if (string.charAt(0).match(/^[a-z]+$/ig) === null) {
            return res.send({ res: 'Error', msg: 'Url code must start with a letter.' });
        } else if (string.match(/^[a-z][a-z\d]+$/ig) === null) {
            return res.send({ res: 'Error', msg: 'Symbols/Spaces not allowed.' });
        }
    }

    next();
}

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

module.exports = router;