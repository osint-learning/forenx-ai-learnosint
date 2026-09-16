const cleanDork = (input) => {
    return String(input || "").trim();
};

const runGoogledorking = async (target) => {
    const dork = cleanDork(target);
    if (!dork) {
        throw new Error("Target dork query is required (e.g. site:example.com).");
    }

    let operator = "general";
    let parameter = dork;

    const opMatch = dork.match(/^([a-zA-Z0-9_-]+):(.*)$/);
    if (opMatch) {
        operator = opMatch[1].toLowerCase() + ":";
        parameter = opMatch[2].trim();
    }

    const matches = [dork];

    let rawOutput = `Google Dorking Query Analyzer: ${dork}\n`;
    rawOutput += `Parsed Operator: ${operator}\n`;
    rawOutput += `Target Parameter: ${parameter}\n`;
    rawOutput += `Discovered Assets / Dork Patterns:\n`;
    matches.forEach((m) => {
        rawOutput += ` - ${m}\n`;
    });

    return {
        dork,
        dorkQuery: dork,
        operator,
        parameter,
        matches,
        matchesCount: matches.length,
        rawOutput: rawOutput.trim(),
    };
};

module.exports = { runGoogledorking };
