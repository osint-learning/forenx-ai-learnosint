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

        case "header": {

            const headerName = fp.header || "server";

            const value = headers[headerName.toLowerCase()];

            if (
                value &&
                value.toLowerCase().includes(fp.pattern.toLowerCase())
            ) {

                matched = true;
                detectedBy = "Header";
                foundEvidence = value;

            }

            break;
        }

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

            case "stylesheet": {

                const stylesheet = stylesheets.find(style =>
                    style &&
                    style.toLowerCase().includes(fp.pattern.toLowerCase())
                );

                if (stylesheet) {

                    matched = true;
                    detectedBy = "Stylesheet";
                    foundEvidence = stylesheet;

                }

                break;
            }
                
            case "html":

                if (html.includes(fp.pattern)) {
                    matched = true;
                    detectedBy = "HTML";
                    foundEvidence = fp.pattern;
                }

                break;

        case "cookie": {

            const cookie = cookies.find(cookie =>
                cookie.toLowerCase().includes(fp.pattern.toLowerCase())
            );

            if (cookie) {

                matched = true;
                detectedBy = "Cookie";
                foundEvidence = cookie;

            }

            break;
        }

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