const { getWhois } = require("../services/recon/whois/whoisService");

async function whoisScan(req, res) {
    try {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({
                success: false,
                message: "Domain is required"
            });
        }

        const result = await getWhois(domain);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    whoisScan,
};