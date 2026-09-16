const { executeCliTool, toolDefinitions } = require("../toolRunner/toolRunner");
const { validateInput } = require("../toolRunner/commandValidator");

const runDig = async (target) => {
    const toolDef = toolDefinitions.dig;
    const validated = validateInput("dig", target, toolDef);
    const domain = validated.target;

    const result = await executeCliTool(toolDef, domain);

    const rawOutput = result.rawOutput || "";
    const lines = rawOutput.split(/\r?\n/);
    const records = [];
    const answers = [];
    let server = null;
    let queryTime = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(";")) {
            const serverMatch = trimmed.match(/^;;\s*SERVER:\s*([^\s]+)/i);
            if (serverMatch) server = serverMatch[1];

            const timeMatch = trimmed.match(/^;;\s*Query time:\s*(\d+\s*m?sec)/i);
            if (timeMatch) queryTime = timeMatch[1];
            continue;
        }

        const parts = trimmed.split(/\s+/);
        if (parts.length >= 5) {
            const record = {
                name: parts[0],
                ttl: parts[1],
                class: parts[2],
                type: parts[3],
                data: parts.slice(4).join(" "),
            };
            records.push(record);
            answers.push(record.data);
        }
    }

    return {
        target: domain,
        records,
        answers: [...new Set(answers)],
        server,
        queryTime,
        exitCode: result.exitCode,
        rawOutput: rawOutput || "No DNS records returned for query.",
    };
};

module.exports = { runDig };
