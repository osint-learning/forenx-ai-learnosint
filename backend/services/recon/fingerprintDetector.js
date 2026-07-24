const { loadFingerprints } = require("./fingerprintLoader");
const { calculateConfidence } = require("./confidenceEngine");

const detectFingerprints = (evidence) => {

    const fingerprints = loadFingerprints();

    const detected = [];

    const {
        html,
        headers,
        scripts,
        stylesheets,
        metaTags
    } = evidence;

    for (const fp of fingerprints) {

        let matched = false;
        let detectedBy = "";
        let foundEvidence = "";

        switch (fp.type) {

            case "header":

                if (
                    headers.server &&
                    headers.server.toLowerCase().includes(fp.pattern.toLowerCase())
                ) {
                    matched = true;
                    detectedBy = "Header";
                    foundEvidence = headers.server;
                }

                break;

            case "script":

                const script = scripts.find(s =>
                    s &&
                    s.toLowerCase().includes(fp.pattern.toLowerCase())
                );

                if (script) {
                    matched = true;
                    detectedBy = "Script";
                    foundEvidence = script;
                }

                break;

            case "html":

                if (html.includes(fp.pattern)) {
                    matched = true;
                    detectedBy = "HTML";
                    foundEvidence = fp.pattern;
                }

                break;

            case "meta":

                for (const key in metaTags) {

                    if (
                        metaTags[key]
                            .toLowerCase()
                            .includes(fp.pattern.toLowerCase())
                    ) {

                        matched = true;
                        detectedBy = "Meta Tag";
                        foundEvidence = metaTags[key];

                        break;
                    }
                }

                break;
        }

        if (matched) {

            detected.push({
                name: fp.name,
                category: fp.category,
                detectedBy,
                evidence: foundEvidence,
                confidence: calculateConfidence({
                    detectedBy
                })
            });

        }

    }

    return detected;
};

module.exports = {
    detectFingerprints
};