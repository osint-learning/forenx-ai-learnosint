const tls = require("tls");

const getSSLInfo = (domain) => {
    return new Promise((resolve, reject) => {

        const socket = tls.connect(
            443,
            domain,
            {
                servername: domain,
                rejectUnauthorized: false,
            },
            () => {

                const cert = socket.getPeerCertificate();

                if (!cert || Object.keys(cert).length === 0) {
                    socket.end();
                    return reject(new Error("No SSL certificate found."));
                }

                const validFrom = new Date(cert.valid_from);
                const validTo = new Date(cert.valid_to);

                const today = new Date();

                const daysRemaining = Math.ceil(
                    (validTo - today) / (1000 * 60 * 60 * 24)
                );

                const expired = daysRemaining < 0;

                socket.end();

                resolve({
                    issuer: cert.issuer?.O || "Unknown",
                    subject: cert.subject?.CN || "Unknown",
                    validFrom,
                    validTo,
                    daysRemaining,
                    expired,
                });

            }
        );

        socket.on("error", (err) => {
            reject(err);
        });

    });
};

module.exports = {
    getSSLInfo,
};