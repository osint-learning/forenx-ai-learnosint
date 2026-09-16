const { terminalCommand } = require("../controllers/reconController");

function createMockRes() {
    return {
        statusCode: 200,
        responseData: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.responseData = data;
            return this;
        },
    };
}

async function runTerminalTests() {
    console.log("=== ForenX AI LearnOSINT - Step 3 Terminal Integration Test Suite ===\n");

    // 1. DIG
    console.log("1. Testing Terminal: 'dig example.com'");
    const res1 = createMockRes();
    await terminalCommand({ body: { command: "dig example.com" } }, res1);
    console.log("Status:", res1.statusCode);
    console.log("Response Success:", res1.responseData?.success);
    console.log("Tool:", res1.responseData?.data?.tool);
    console.log("Output Snippet:\n", String(res1.responseData?.data?.rawOutput || "").slice(0, 300));
    console.log("\n------------------------------------------------------------");

    // 2. SUBFINDER
    console.log("2. Testing Terminal: 'subfinder -d example.com -silent'");
    const res2 = createMockRes();
    await terminalCommand({ body: { command: "subfinder -d example.com -silent" } }, res2);
    console.log("Status:", res2.statusCode);
    console.log("Response Success:", res2.responseData?.success);
    console.log("Tool:", res2.responseData?.data?.tool);
    console.log("Output Snippet:\n", String(res2.responseData?.data?.rawOutput || "").slice(0, 300));
    console.log("\n------------------------------------------------------------");

    // 3. ASSETFINDER
    console.log("3. Testing Terminal: 'assetfinder --subs-only example.com'");
    const res3 = createMockRes();
    await terminalCommand({ body: { command: "assetfinder --subs-only example.com" } }, res3);
    console.log("Status:", res3.statusCode);
    console.log("Response Success:", res3.responseData?.success);
    console.log("Tool:", res3.responseData?.data?.tool);
    console.log("Output Snippet:\n", String(res3.responseData?.data?.rawOutput || "").slice(0, 300));
    console.log("\n------------------------------------------------------------");

    // 4. NMAP
    console.log("4. Testing Terminal: 'nmap -F example.com'");
    const res4 = createMockRes();
    await terminalCommand({ body: { command: "nmap -F example.com" } }, res4);
    console.log("Status:", res4.statusCode);
    console.log("Response Success:", res4.responseData?.success);
    console.log("Tool:", res4.responseData?.data?.tool);
    console.log("Output Snippet:\n", String(res4.responseData?.data?.rawOutput || "").slice(0, 300));
    console.log("\n------------------------------------------------------------");

    // 5. PRACTICE LAB RESTRICTION TESTS
    console.log("5. Testing Practice Lab Restriction (DIG Lab):");
    console.log("  5a. Valid command 'dig example.com' with practiceTool: 'dig'");
    const res5a = createMockRes();
    await terminalCommand({ body: { command: "dig example.com", practiceTool: "dig" } }, res5a);
    console.log("  Status:", res5a.statusCode, "(Expected: 200)");
    console.log("  Success:", res5a.responseData?.success);

    console.log("  5b. Invalid command 'nmap example.com' with practiceTool: 'dig'");
    const res5b = createMockRes();
    await terminalCommand({ body: { command: "nmap example.com", practiceTool: "dig" } }, res5b);
    console.log("  Status:", res5b.statusCode, "(Expected: 400)");
    console.log("  Message:", res5b.responseData?.message);
    console.log("\n------------------------------------------------------------");

    // 6. WHOIS REGRESSION TEST (Existing Service Implementation)
    console.log("6. Testing WHOIS Regression: 'whois example.com'");
    const res6 = createMockRes();
    await terminalCommand({ body: { command: "whois example.com" } }, res6);
    console.log("Status:", res6.statusCode);
    console.log("Response Success:", res6.responseData?.success);
    console.log("WHOIS Data keys:", Object.keys(res6.responseData?.data || {}));
    console.log("Domain Name:", res6.responseData?.data?.domainName || res6.responseData?.data?.domain_name || "Returned");
    console.log("\n------------------------------------------------------------");

    // 7. NSLOOKUP REGRESSION TEST (Existing Native Implementation)
    console.log("7. Testing NSLOOKUP Regression: 'nslookup example.com'");
    const res7 = createMockRes();
    await terminalCommand({ body: { command: "nslookup example.com" } }, res7);
    console.log("Status:", res7.statusCode);
    console.log("Response Success:", res7.responseData?.success);
    console.log("NSLOOKUP Addresses:", res7.responseData?.data?.addresses);
    console.log("\n------------------------------------------------------------");

    // 8. RECON FULL SCAN REGRESSION TEST (Existing Recon Engine)
    console.log("8. Testing RECON Regression: 'recon example.com'");
    const res8 = createMockRes();
    await terminalCommand({ body: { command: "recon example.com" } }, res8);
    console.log("Status:", res8.statusCode);
    console.log("Response Success:", res8.responseData?.success);
    console.log("Recon Data Keys:", Object.keys(res8.responseData?.data || {}));
    console.log("\n============================================================");
    console.log("ALL TERMINAL INTEGRATION & REGRESSION TESTS FINISHED!");
}

runTerminalTests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
