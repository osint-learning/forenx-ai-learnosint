const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const runExiftool = (target) => {
    return new Promise((resolve, reject) => {
        const cleanPath = String(target || "").trim();
        if (!cleanPath) {
            return reject(new Error("Target file path is required for exiftool. Example: uploads/sample.jpg"));
        }

        // Check if file exists locally
        const resolvedPath = path.isAbsolute(cleanPath)
            ? cleanPath
            : path.join(process.cwd(), cleanPath);

        if (!fs.existsSync(resolvedPath)) {
            return reject(
                new Error(
                    `Target file does not exist: ${cleanPath}. Please provide a valid image or document file path.`
                )
            );
        }

        const child = spawn("exiftool", ["-j", resolvedPath], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("exiftool command timed out after 10 seconds."));
        }, 10000);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timeout);
            if (error.code === "ENOENT") {
                return reject(
                    new Error(
                        "exiftool is not installed or not available in the system PATH. Please install ExifTool (https://exiftool.org)."
                    )
                );
            }
            reject(error);
        });

        child.on("close", (code) => {
            clearTimeout(timeout);

            const rawOutput = stdout.trim();
            if (!rawOutput && stderr.trim()) {
                return reject(new Error(stderr.trim()));
            }

            let meta = {};
            try {
                const parsed = JSON.parse(rawOutput);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    meta = parsed[0];
                }
            } catch (e) {}

            resolve({
                fileName: meta.FileName || path.basename(resolvedPath),
                mimeType: meta.MIMEType || "application/octet-stream",
                fileSize: meta.FileSize || "Unknown",
                imageWidth: meta.ImageWidth || meta.ExifImageWidth || null,
                imageHeight: meta.ImageHeight || meta.ExifImageHeight || null,
                camera: meta.Model || meta.Make || null,
                gps: meta.GPSPosition || meta.GPSCoordinates || null,
                metadata: meta,
                exitCode: code,
                rawOutput: rawOutput || "No metadata extracted.",
            });
        });
    });
};

module.exports = { runExiftool };
