const technologyRules = require("./technologyRules");
const { calculateConfidence } = require("./confidenceEngine");

const detectTechnologies = (evidence) => {

    const { html, headers } = evidence;

    const detected = [];

    for (const rule of technologyRules) {

        try {

            const result = rule.match(evidence);

            if (result) {

                detected.push({
                    name: rule.name,
                    category: rule.category,
                    detectedBy: result.detectedBy,
                    evidence: result.evidence,
                    confidence: calculateConfidence(result)
                });

            }

        } catch (err) {
            // Ignore failed rules
        }

    }

    return detected;

};

module.exports = {
    detectTechnologies,
};