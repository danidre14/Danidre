const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const Token = require('../models/token');

router.get('/', checkNotAuthenticated, (req, res) => {
    let vars = {cPage: "signup", searchOptions: req.query};
    vars.uMessage = req.flash('uMessage');
    vars.pMessage = req.flash('pMessage');
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('signup/index', vars);
});

router.post('/', checkNotAuthenticated, validateInfomation, checkUserExists, createUser);


//Normal Confimation Page Route
router.get('/verify', checkNotAuthenticated, (req, res) => {
    let vars = {cPage: "signup", searchOptions: req.query};
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('signup/verify', vars);
});

//Create Confimation Page Route
router.post('/verify', async (req, res) => {
    try {
        const token = await Token.findOne({token:req.body.token});
        //Check if token exists
        if(!token) {
            req.flash('outsert', {message: 'The activation link does not exist, or may have expired.'});
            return res.redirect('verify/resend'); //their token may have expired
        }

        //Check if token matches account email
        const user = await User.findOne({_id: token._userId, email:req.body.email});
        if(!user) {
            req.flash('outsert', {message: 'Unable to find an account with that email. Correct the information, or sign up today.'});
            return res.redirect('../signup'); //user does not exist
        }

        //Check if user is verified
        token.deleteOne({token:req.body.token}, function (err) {});
        if(user.isVerified) {
            req.flash('outsert', {message: 'Account already verified. Please sign in.', note: true});
            return res.redirect('../signin'); //user already verified
        }

        //Verify user
        user.isVerified = true; console.log('take out verified true by default');
        await user.save();

        req.flash('outsert', {message: 'Account verified. Please sign in.', note: true});
        res.redirect('../signin'); //Please log in
        
    } catch (err) {
        console.log(err);
        req.flash('outsert', {message: 'An error has occured. Please try again, or contact support.'});
        res.redirect('../signup');
    }
});

async function checkUserExists(req, res, next) {
    //look for user
    const user = await User.findOne({username:req.body.username});

    //if user does not exist
    if(!user) {
        return next(); //proceed to create user
    }

    //if user already exists
    /* 
        if user is verified -> redirect 'username unavailable'
        else if user not verified, but token exists for that user -> redirect 'check your email for verification token'
        else if user not verified, but token does not exist -> redirect 'an email has been sent to verify account'
    */

    //if user verified
    if(user.isVerified) {
        req.flash('outsert', {message: 'Username unavailable.', note: true});
        return res.redirect('signup');
    }
    
    //if user not verified, look for token
    const token = await Token.findOne({_userId:user._id});

    //if token does not exist
    if(!token) {
        // Create a verification token
        const newToken = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await newToken.save();

        // Send the email
        const mailOptions = {
            from: 'no-reply@danidre.com',
            to: user.email,
            subject: 'Account Verification Token',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/signup\/verify?token=' + newToken.token + '.\n'
        };
        sendMail(mailOptions, user.email);

        req.flash('outsert', {message: `A token has been resent to ${user.email}. Check your email to verify your account.`});
        return res.redirect('signin');
    }

    //if token exists
    req.flash('outsert', {message: 'Account already registered. Check your email for the verification token.'});
    res.redirect('signin');
}

function sendMail(mailOptions, email) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return console.log('Mail sent, make sure to actually send here');
    sgMail.send(mailOptions, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('A verification email has been sent to ' + email + '.');
    });
}

async function createUser(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //users.push
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            jewel: 'funny'
        });

        await user.save();
        // Create a verification token
        const token = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        // Send the email
        const mailOptions = {
            from: 'no-reply@danidre.com',
            to: user.email,
            subject: 'Account Verification Token',
            text: `Hello ${user.username},\n\n
            Please verify your account by clicking the link: \nhttp:\/\/${req.headers.host}\/signup\/verify?token=${token.token}.\n`,
            html: `Hello ${user.username},<br/><br/>
            Please verify your account by clicking the link: <br/><a href="http:\/\/${req.headers.host}\/signup\/verify?token=${token.token}">http:\/\/${req.headers.host}\/signup\/verify?token=${token.token}</a>.`
        };
        sendMail(mailOptions, user.email);
        
        req.flash('outsert', {message: `A token has been sent to ${user.email}. Check your email to verify your account.`, note: true});
        res.redirect('signin');
        //res.redirect(`users/${newUser.username}`);
    } catch (err) {
        console.log(err)
        req.flash('outsert', {message: 'An error has occured. Please try again, or contact support.'});
        res.redirect('signup');
    }
}


function validateInfomation(req, res, next) {
    //username validation
    let username = req.body.username;
    let uError = false;
    let uMessage = "";
    if(username.length < 4 || username.length > 15) {
        uMessage += "-Must be 4-15 characters long";
        uError = true;
    } else {
        if(username.charAt(0).match(/^[a-z]+$/ig) === null) {
            uMessage += "-Username must start with a letter\n";
            uError = true;
        } else if(username.match(/^[a-z][a-z\d]+$/ig) === null) {
            uMessage += "-Symbols/Spaces not allowed";
            uError = true;
        } 
    }
    
    //password validation
    let pName = req.body.password;
    let pError = false;
    let pMessage = "";
    if(pName.length < 8) {
        pMessage += "-Password must be 8 or more characters\n";
        pError = true;
    }
    // if(pName.match(/^[a-z\d]+$/ig) === null) {
    //     pMessage += "-Password cannot contain symbols or spaces\n";
    //     pError = true;
    // }
    if(pName.search(/\d/) === -1) {
        pMessage += "-Must contain at least one number\n";
        pError = true;
    }
    if(pName.search(/[A-Z]/) === -1) {
        pMessage += "-Must contain at least one uppercase letter\n";
        pError = true;
    }

    //redirect if needed
    if(uError || pError) {
        req.flash('uMessage', uMessage);
        req.flash('pMessage', pMessage);
        return res.redirect('signup');
    }

    next();
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
  
    next();
}

router.use('/*', (req, res) => {
    res.redirect('/signup');
})

module.exports = router;