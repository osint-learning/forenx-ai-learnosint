const fs = require("fs");
const path = require("path");

const fingerprintDir = path.join(__dirname, "fingerprints");

const loadFingerprints = () => {

    const fingerprints = [];

    const files = fs.readdirSync(fingerprintDir);

    for (const file of files) {

        if (!file.endsWith(".json")) {
            continue;
        }

        const filePath = path.join(fingerprintDir, file);

        try {

            const data = JSON.parse(
                fs.readFileSync(filePath, "utf8")
            );

            fingerprints.push(...data);

        } catch (err) {

            console.error(`Failed to load ${file}:`, err.message);

        }

    }

    return fingerprints;
};

module.exports = {
    loadFingerprints
};