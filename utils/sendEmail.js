const nodemailer = require('nodemailer');

const testEmail = true;

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // Auto-secure if using port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(mailOptions, email) {
    if (process.env.NODE_ENV !== 'production' && !testEmail) {
        console.log('--- Dev Mode: Email Simulation ---');
        console.log(`To: ${email} | Subject: ${mailOptions.subject}`);
        return;
    }

    try {
        // If no 'from' is provided, use the env address formatted with your brand name
        if (!mailOptions.from) {
            mailOptions.from = `Danidre <${process.env.EMAIL_SENDER}>`;
        }
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    } catch (err) {
        console.error("SMTP Error:", err.message);
    }
}


module.exports = { sendEmail, testEmail };
