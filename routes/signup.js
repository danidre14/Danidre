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
    vars.p2Message = req.flash('p2Message');
    vars.title = "Sign Up";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    res.render('signup/index', vars);
});

router.post('/', checkNotAuthenticated, validateInfomation, checkUserExists, createUser);

//Verify Prompt Route
router.get('/v', checkNotAuthenticated, (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Verify Account";
    if(req.isAuthenticated()) {
        vars.username = req.user.username;
    }
    vars.description = "Check your email for a link to verify your account. Check your spam folders if you can't find any email.";
    res.render('misc/blank', vars);
});

//Normal Confimation Page Route
router.get('/verify', checkNotAuthenticated, (req, res) => {
    let vars = {cPage: "signup", searchOptions: req.query};
    vars.title = "Verify Account";
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
            req.flash('outsert', {message: 'Account already verified. You can sign in.', note: true});
            return res.redirect('../signin'); //user already verified
        }

        //Verify user
        user.isVerified = true;
        await user.save();

        req.flash('outsert', {message: 'Account verified. You may now sign in.', note: true});
        res.redirect('../signin'); //Please log in
        
    } catch (err) {
        console.log(err);
        req.flash('outsert', {message: 'An error has occured. Please try again, or contact support.'});
        res.redirect('../signup');
    }
});

async function checkUserExists(req, res, next) {
try {
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
        req.flash('outsert', {message: 'Username unavailable.'});
        return res.redirect('/signup');
    }
    
    //if user not verified, look for token
    const token = await Token.findOne({_userId:user._id});

    //if token does not exist
    if(!token) {
        // Create a verification token
        const newToken = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await newToken.save();

        // Send the email for resend token
        const mailOptions = getMailOptions(user.username, user.email, req.headers.host, newToken.token);
        
        sendMail(mailOptions, user.email);

        req.flash('outsert', {message: `A token has been resent to ${user.email}. Check your email to verify your account.`});
        return res.redirect('/signup/v');
    }

    //if token exists
    req.flash('outsert', {message: 'Account already registered. Check your email for the verification token.'});
    res.redirect('/signin');
} catch (err) {
    console.log(err)
}
}

async function createUser(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //users.push
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        if(process.env.NODE_ENV !== 'production') {
            user.isVerified = true; //verified by default if not in production
            await user.save();
            req.flash('outsert', {message: `Development account ${user.email} created. Sign in with username ${user.username}.`, note: true});
            return res.redirect('/signin');
        }

        await user.save();
        // Create a verification token
        const token = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();

        // Send the email
        const mailOptions = getMailOptions(user.username, user.email, req.headers.host, token.token);

        sendMail(mailOptions, user.email);
        
        req.flash('outsert', {message: `A token has been sent to ${user.email}. Check your email to verify your account.`});
        res.redirect('/signup/v');
        //res.redirect(`users/${newUser.username}`);
    } catch (err) {
        console.log(err)
        req.flash('outsert', {message: 'An error has occured. Please try again, or contact support.'});
        res.redirect('/signup');
    }
}


function validateInfomation(req, res, next) {
    let error = false;

    //username validation
    let username = req.body.username;
    let uMessage = "";
    if(username.length < 4 || username.length > 15) {
        uMessage += "-Must be 4-15 characters long";
        error = true;
    } else {
        if(username.charAt(0).match(/^[a-z]+$/ig) === null) {
            uMessage += "-Username must start with a letter\n";
            error = true;
        } else if(username.match(/^[a-z][a-z\d]+$/ig) === null) {
            uMessage += "-Symbols/Spaces not allowed";
            error = true;
        } 
    }
    
    //password validation
    let pName = req.body.password;
    let pMessage = "";
    if(pName.length < 8) {
        pMessage += "-Password must be 8 or more characters\n";
        error = true;
    }
    // if(pName.match(/^[a-z\d]+$/ig) === null) {
    //     pMessage += "-Password cannot contain symbols or spaces\n";
    //     error = true;
    // }
    if(pName.search(/\d/) === -1) {
        pMessage += "-Must contain at least one number\n";
        error = true;
    }
    if(pName.search(/[A-Z]/) === -1) {
        pMessage += "-Must contain at least one uppercase letter\n";
        error = true;
    }

    //re-entered password
    let p2Name = req.body.password2;
    let p2Message = "";
    if(pName !== p2Name) {
        p2Message += "-Password do not match";
        error = true;
    }

    //redirect if needed
    if(error) {
        req.flash('uMessage', uMessage);
        req.flash('pMessage', pMessage);
        req.flash('p2Message', p2Message);
        return res.redirect('signup');
    }

    next();
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect(`/u/${req.user.username}`);
    }
  
    next();
}


function getMailOptions(username='User', email, host, token) {
    const tokenLink = `http:\/\/${host}\/signup\/verify?token=${token}`;
    const options = {
        from: 'Danidre <no-reply@danidre.com>',
        to: `${username} <${email}>`,
        subject: 'Account Verification Token',
        text: `Hello ${username},\n\n
        Please verify your account by clicking the following link: \n${tokenLink}.\n`,
        html: `Hello ${username},<br/><br/>
        Please verify your account by clicking the following link: <br/><a href="${tokenLink}">${tokenLink}</a>.`

    };
    return options;
}



function sendMail(mailOptions, email) {
    if(process.env.NODE_ENV !== 'production') {
        //development environment
        return console.log('Mail sent, make sure to actually send here');
    }
    
    //otherwise, send mail
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(mailOptions, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('A verification email has been sent to ' + email + '.');
    });
}

router.use('/*', (req, res) => {
    res.redirect('/signup');
})

module.exports = router;