const calculateRisk = (findings) => {
    let score = 0;

    findings.forEach((finding) => {
        if (finding.status === "Missing") {
            switch (finding.severity) {
                case "High":
                    score += 25;
                    break;

                case "Medium":
                    score += 15;
                    break;

                case "Low":
                    score += 5;
                    break;
            }
        }
    });

    let level = "";

    if (score <= 20) {
        level = "Low";
    } else if (score <= 50) {
        level = "Medium";
    } else {
        level = "High";
    }

    return {
        score,
        level,
    };
};

module.exports = {
    calculateRisk,
};