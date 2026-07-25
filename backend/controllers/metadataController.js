const { getMetadata } = require("../services/recon/metadata/metadataService");

async function metadataScan(req, res) {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const result = await getMetadata(url);

        res.json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    metadataScan,
};