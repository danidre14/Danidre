const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const Token = require('../models/token');

const testEmail = false;

router.get('/', checkNotAuthenticated, async (req, res) => {
    let vars = {cPage: "signup", searchOptions: req.query};
    vars.uMessage = req.flash('uMessage');
    vars.pMessage = req.flash('pMessage');
    vars.p2Message = req.flash('p2Message');
    vars.e2Message = req.flash('e2Message');
    vars.title = "Sign Up";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    res.render('signup/index', vars);
});

router.post('/', checkNotAuthenticated, validateInfomation, checkUserExists, createUser);

//Verify Prompt Route
router.get('/v', checkNotAuthenticated, async (req, res) => {
    let vars = {cPage: "secret", searchOptions: req.query};
    vars.title = "Verify Account";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    vars.description = "Check your email for a link to verify your account. Check your spam folders if you can't find any email.";
    res.render('misc/blank', vars);
});

//Normal Confimation Page Route
router.get('/verify', checkNotAuthenticated, async (req, res) => {
    let vars = {cPage: "signup", searchOptions: req.query};
    vars.title = "Verify Account";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    res.render('signup/verify', vars);
});

//Create Confimation Page Route
router.post('/verify', checkNotAuthenticated, async (req, res) => {
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
        await token.remove();
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
        console.log("Message:", err.message);
        req.flash('outsert', {message: 'An error has occured. Please try again, or contact support.'});
        res.redirect('../signup');
    }
});

async function checkUserExists(req, res, next) {
    try {
        //look for user
        const user = await User.findOne({username: new RegExp("^" + req.body.username + "$", "i")});

        //if user does not exist
        if(!user) {
            return next(); //proceed to create user
        }

        //if user already exists
        /* 
            if user is verified -> redirect 'username unavailable'
            else if user not verified, but token exists for that user -> 
            if email exists: redirect 'check your email for verification token'
            else if user not verified, but token does not exist -> redirect 'an email has been sent to verify account'
            or if email does not exist
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
        
        //look for user email
        if(user.email === req.body.email) {//email exists
            //check email for verification token
            req.flash('outsert', {message: 'Account already registered. Check your email for the verification token.'});
            return res.redirect('/signin');
        } else {//emal does not exist
            //save new email
            user.email = req.body.email;
            await user.save();

            // Create a verification token
            const newToken = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            await newToken.save();

            // Send the email for resend token
            const mailOptions = getMailOptions(user.username, user.email, req.headers.host, newToken.token);

            sendMail(mailOptions, user.email);

            req.flash('outsert', {message: `A token has been sent to ${user.email}. Check your email to verify your account.`});
            return res.redirect('/signup/v');
        }
    } catch (e) {
        console.log("Message:", e.message);
        req.flash('outsert', {message: 'Error Occurred.'});
        return res.redirect('/signup');
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

        if(process.env.NODE_ENV !== 'production' && !testEmail) {
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
    } catch (e) {
        console.log("Message:", e.message);
        req.flash('outsert', {message: 'An error has occured. Please report this issue or try again.'});
        res.redirect('/signup');
    }
}


function validateInfomation(req, res, next) {
    let error = false;

    //username validation
    const username = req.body.username;
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
    const pName = req.body.password;
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
    const p2Name = req.body.password2;
    let p2Message = "";
    if(pName !== p2Name) {
        p2Message += "-Passwords do not match";
        error = true;
    }

    //re-entered email
    const email = req.body.email;
    const email2 = req.body.email2;
    let e2Message = "";
    if(email !== email2) {
        e2Message += "-Emails do not match";
        error = true;
    }

    //redirect if needed
    if(error) {
        req.flash('uMessage', uMessage);
        req.flash('pMessage', pMessage);
        req.flash('p2Message', p2Message);
        req.flash('e2Message', e2Message);
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
    const protocol = `https`;
    const siteLink = `${protocol}:\/\/${host}`;
    const tokenLink = `${siteLink}\/signup\/verify?token=${token}`;
    const options = {
        from: 'Danidre <no-reply@danidre.com>',
        to: `${username} <${email}>`,
        subject: 'Danidre: Account Verification Token',
        text: `Hello ${username},\n\n
        Please verify your account by clicking the following link: \n${tokenLink}.\n`,
        html: `<body style="margin:0;padding:0;">
	    <div style="padding:0;margin:0;text-align:center;font-size:1.4rem;color:#E3DBD8;padding:0;font-family:Helvetica;">
            <h1 style="background-color:#989586;color:#E3DBD8;margin:0;padding:2rem 0;font-size:5rem;background-image:url('https://danidre.herokuapp.com/images/Danidrebackground.jpg');background-repeat: no-repeat;background-size: 100%;background-position: center;font-weight:bold;"><a style="text-decoration:none;color:#E3DBD8;" href="${siteLink}">Danidre</a></h1>
            <div style="background-color:#968176;margin:0;padding:.4rem;font-size:1.6rem;">EMAIL</div>
            <div style='background-color:#D2CBC5;color:#615755;margin:0;padding:0px 1rem;'>
                <h2 style="font-size:2.5rem;color:#3C2E2D;margin:0;padding:1rem;">Hello ${username},</h2>
                <section style="border-top:2px solid #968176;">
                    <div style="text-align:left;">
                    <p style="font-size:1.8rem;color:#3C2E2D;padding:1.4rem;margin:0;">Welcome to Danidre.com. Before you sign in, however, you are required to verify your account.</p>
                    <p style="color:#3C2E2D;padding:1.4rem;margin:0;">Please verify your account by clicking the button below:</p>
                    <a style='background-color:#968176;color:#E3DBD8;text-decoration:none;padding:.7rem 1rem;font-size: 1rem;display:inline-block;border-radius: .5rem;margin-left:1.4rem;' href="${tokenLink}">Verify Account</a>
                    </div>
                    <div style="text-align:left;">
                    <p style="color:#3C2E2D;padding:1.4rem;margin:0;">If the button does not work, copy/paste the link below into a new tab:</p>
                    <a style='color:#968176;padding:1.4rem;margin:0;' href="${tokenLink}">${tokenLink}</a>
                    </div>
                </section>
                <section style="border-top:2px solid #968176;margin-top:1.6rem;">
                    <p style="padding-bottom:1rem;margin-bottom:0;font-size:1.1rem;padding-top:.8rem;">Don't recognize this activity? You can ignore this e-mail. No further action is needed.</p>
                </section>
            </div>
            <div style="background-color:#968176;margin:0;padding:.4rem;font-size:1.6rem;"><a style="text-decoration:none;" href="${siteLink}"><span style="color:#3C2E2D;font-weight:bold;">Danidre</span> <span style="color:#E3DBD8;">2014-19</span></a></div>
        </div>
	</body>`
    };
    return options;
}



function sendMail(mailOptions, email) {
    if(process.env.NODE_ENV !== 'production' && !testEmail) {
        //development environment
        return console.log('Mail sent, make sure to actually send here');
    }
    
    //otherwise, send mail
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(mailOptions, function (err) {
        if (err) {
            return console.log("Message:", err.message);
        }
        console.log('A verification email has been sent to ' + email + '.');
    });
}

router.use('/*', (req, res) => {
    res.redirect('/signup');
})

module.exports = router;