const { spawn } = require("child_process");

const cleanTarget = (input) => {
    return String(input || "").trim();
};

const runSpiderfoot = (target) => {
    return new Promise((resolve, reject) => {
        const clean = cleanTarget(target);
        if (!clean) {
            return reject(new Error("Target is required for spiderfoot."));
        }

        const child = spawn("sf", ["-s", clean, "-u", "cli"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("spiderfoot command timed out after 30 seconds."));
        }, 30000);

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
                        "spiderfoot (sf) is not installed or not available in the system PATH. Please install SpiderFoot."
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

            let moduleCount = 0;
            let entitiesFound = 0;
            const findings = [];

            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.includes("Module:")) {
                    moduleCount++;
                }
                if (trimmed.includes("Found:")) {
                    entitiesFound++;
                    findings.push(trimmed);
                }
            }

            resolve({
                target: clean,
                moduleCount: moduleCount || 1,
                entitiesFound: entitiesFound || findings.length,
                findings,
                exitCode: code,
                rawOutput: rawOutput || "spiderfoot completed.",
            });
        });
    });
};

module.exports = { runSpiderfoot };
