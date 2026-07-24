const calculateConfidence = (technology) => {

    switch (technology.detectedBy) {

        case "Header":
            return 95;

        case "Meta Tag":
            return 90;

        case "HTML":
            return 85;

        case "Script":
            return 80;

        case "CSS":
            return 75;

        default:
            return 60;
    }
};

module.exports = {
    calculateConfidence,
};