const { spawn } = require("child_process");

const cleanPhone = (input) => {
    return String(input || "").trim().replace(/[^0-9+]/g, "");
};

const runPhoneinfoga = (target) => {
    return new Promise((resolve, reject) => {
        const phone = cleanPhone(target);
        if (!phone) {
            return reject(new Error("Target phone number is required for phoneinfoga. E.g. +14155552671"));
        }

        const child = spawn("phoneinfoga", ["scan", "-n", phone], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("phoneinfoga command timed out after 15 seconds."));
        }, 15000);

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
                        "phoneinfoga is not installed or not available in the system PATH. Please install phoneinfoga."
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

            let valid = null;
            let carrier = null;
            let country = null;

            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (/Valid:s*(true|false)/i.test(trimmed)) {
                    valid = /true/i.test(trimmed);
                } else if (/Carrier:s*(.+)/i.test(trimmed)) {
                    carrier = trimmed.match(/Carrier:s*(.+)/i)[1].trim();
                } else if (/Country:s*(.+)/i.test(trimmed)) {
                    country = trimmed.match(/Country:s*(.+)/i)[1].trim();
                }
            }

            resolve({
                phone,
                valid: valid !== null ? valid : true,
                carrier: carrier || "Unknown / Not Reported",
                country: country || "Unknown",
                exitCode: code,
                rawOutput: rawOutput || "phoneinfoga scan completed.",
            });
        });
    });
};

module.exports = { runPhoneinfoga };
