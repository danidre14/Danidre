const https = require('https');

function verifyRecaptcha(token, remoteIp) {
    return new Promise((resolve, reject) => {
        const secret = process.env.RECAPTCHA_SECRET;
        if (!secret) return resolve({ success: false, 'error-codes': ['missing-secret'] });
        if (!token) return resolve({ success: false, 'error-codes': ['missing-input-response'] });

        const postData = `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}${remoteIp ? `&remoteip=${encodeURIComponent(remoteIp)}` : ''}`;

        const options = {
            hostname: 'www.google.com',
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

module.exports = { verifyRecaptcha };
