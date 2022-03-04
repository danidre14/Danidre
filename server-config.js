const fs = require("fs");
const https = require("https");

module.exports = function (app) {
    if (process.env.NODE_ENV !== "production") {
        const localhostKeyPemPath = __dirname + "/local_ca_cert/cert.key";
        const localhostPemPath = __dirname + "/local_ca_cert/cert.crt";
        try {
            if (fs.existsSync(localhostKeyPemPath) && fs.existsSync(localhostPemPath)) {
                const key = fs.readFileSync(localhostKeyPemPath, "utf-8");
                const cert = fs.readFileSync(localhostPemPath, "utf-8");
                
                return https.createServer({ key, cert }, app)
            }
        } catch { }
    }
    return app;
};