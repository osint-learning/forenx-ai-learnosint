const { detectTechnology } = require("../services/recon/technology/technologyService");
const technologyScan = async (req, res) => {
    try {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({
                success: false,
                message: "Domain is required"
            });
        }

        const result = await detectTechnology(domain);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    technologyScan,
};