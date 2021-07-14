const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');

const testEmail = false;

router.get('/', async (req, res) => {
    let vars = {cPage: "contact", searchOptions: req.query};
    vars.formName = req.flash('formName');
    vars.formSubject = req.flash('formSubject');
    vars.formMessage = req.flash('formMessage');
    vars.bodyName = req.flash('bodyName') || '';
    vars.bodyEmail = req.flash('bodyEmail') || '';
    vars.bodySubject = req.flash('bodySubject') || '';
    vars.bodyMessage = req.flash('bodyMessage') || '';
    vars.title = "Contact";
    if(req.isAuthenticated()) {
        try {
            const user = await User.findOne({username: new RegExp("^" + req.user.username + "$", "i")}, 'username firstName lastName email profileImage profileImageType');
            vars.user = user;
        } catch {}
    }
    res.render('contact/index', vars);
});

router.post('/', validateInfomation, (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const subject = req.body.subject;
        const message = req.body.message;
        // Send the email
        const mailOptions = getMailOptions(name, email, subject, message, req.headers.host);

        sendMail(mailOptions, email);

        req.flash('outsert', {message: 'Your message has been sent.'});
        res.redirect('/contact');
    } catch (e) {
        console.log("Message:", e.message);
        req.flash('outsert', {message: 'An error has occured. Please report this issue or try again.'});
        res.redirect('/contact');
    }
});

router.use('/*', (req, res) => {
    res.redirect('/contact');
});



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
        console.log('An email has been sent from ' + email + '.');
    });
}



function getMailOptions(name='Anonymous User', email, subject, message, host) {
    const protocol = `https`;
    const siteLink = `${protocol}:\/\/${host}`;
    const options = {
        from: `${name} <${email}>`,
        replyTo: `<${email}>`,
        to: `<danidre14@gmail.com>`,
        subject: subject,
        text: `Dear Danidre,\n\n
        ${message}\nSincerely,\n${name}.`,
        html: `<body style="margin:0;padding:0;">
	    <div style="padding:0;margin:0;text-align:center;font-size:1.4rem;color:#E3DBD8;padding:0;font-family:Helvetica;">
            <h1 style="background-color:#989586;color:#E3DBD8;margin:0;padding:2rem 0;font-size:5rem;background-image:url('https://danidre.com/images/Danidrebackground.jpg');background-repeat: no-repeat;background-size: 100%;background-position: center;font-weight:bold;"><a style="text-decoration:none;color:#E3DBD8;" href="${siteLink}">Danidre</a></h1>
            <div style="background-color:#968176;margin:0;padding:.4rem;font-size:1.6rem;">EMAIL</div>
            <div style='background-color:#D2CBC5;color:#615755;margin:0;padding:0px 1rem;'>
                <h2 style="font-size:2.5rem;color:#3C2E2D;margin:0;padding:1rem;">Dear Danidre</h2>
                <section style="border-top:2px solid #968176;">
                    <div style="text-align:left;">
                        <p style="font-size:1.8rem;color:#3C2E2D;padding:1.4rem;margin:0;">${message}</p>
                    </div>
                    <div style="text-align:left;">
                        <p style="color:#3C2E2D;padding:1.4rem;margin:0;">Sincerely,<br/>${name}.</p>
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

function validateInfomation(req, res, next) {
    let error = false;

    //name validation
    const name = req.body.name;
    let formName = "";
    if(name.length < 3 || name.length > 30) {
        formName += "-Must be 3-30 characters long";
        error = true;
    } else {
        if(name.charAt(0).match(/^[a-z]+$/ig) === null) {
            formName += "-Name must start with a letter\n";
            error = true;
        }
    }
    
    //subject validation
    const subject = req.body.subject;
    let formSubject = "";
    if(subject.length < 5 || subject.length > 50) {
        formSubject += "-Must be 5-50 characters long";
        error = true;
    } else {
        if(subject.charAt(0).match(/^[a-z]+$/ig) === null) {
            formSubject += "-Subject must start with a letter\n";
            error = true;
        }
    }
    
    //message validation
    const message = req.body.message;
    let formMessage = "";
    if(message.length < 10 || message.length > 128) {
        formMessage += "-Must be 10-128 characters long";
        error = true;
    } else {
        if(message.charAt(0).match(/^[a-z]+$/ig) === null) {
            formMessage += "-Message must start with a letter\n";
            error = true;
        }
    }

    //redirect if needed
    if(error) {
        req.flash('formName', formName);
        req.flash('formSubject', formSubject);
        req.flash('formMessage', formMessage);
        req.flash('bodyName', name || '');
        req.flash('bodyEmail', req.body.email || '');
        req.flash('bodySubject', subject || '');
        req.flash('bodyMessage', message || '');
        return res.redirect('/contact');
    }

    next();
}

module.exports = router;