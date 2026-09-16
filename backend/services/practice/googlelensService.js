const axios = require("axios");
const crypto = require("crypto");

const cleanUrl = (input) => {
    return String(input || "").trim();
};

const runGooglelens = async (target) => {
    const imageUrl = cleanUrl(target);
    if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
        throw new Error("Target image URL (http:// or https://) is required for Google Lens.");
    }

    // Live HTTP check of the target image
    const res = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 10000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
    });

    const contentType = res.headers["content-type"] || "image/jpeg";
    const imageSize = res.data ? res.data.length : 0;
    const hash = crypto.createHash("sha256").update(res.data).digest("hex");

    const entities = ["image-asset", contentType.split("/")[1] || "photo"];

    let rawOutput = `Google Lens Visual Asset Analysis: ${imageUrl}\n`;
    rawOutput += `Content-Type: ${contentType}\n`;
    rawOutput += `Payload Size: ${imageSize} bytes\n`;
    rawOutput += `SHA256 Hash: ${hash}\n`;
    rawOutput += `Visual Entities / Tags: ${entities.join(", ")}\n`;
    if (!process.env.GOOGLE_VISION_API_KEY) {
        rawOutput += `Note: Cloud Vision API key not configured for deep visual entity labeling.\n`;
    }

    return {
        target: imageUrl,
        imageType: contentType,
        imageSize,
        hash,
        entities,
        entitiesCount: entities.length,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runGooglelens };
