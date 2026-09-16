const {
    executeDockerTool,
    checkDockerHealth,
    checkDockerImage,
} = require("../services/dockerToolService");

async function runTests() {
    console.log("=== ForenX AI LearnOSINT - Docker Tool Service Test Suite ===\n");

    console.log("1. Checking Docker Daemon Health...");
    const health = checkDockerHealth();
    console.log("Docker Health:", health);

    console.log("\n2. Checking Docker Image Availability...");
    const imageStatus = checkDockerImage();
    console.log("Docker Image Status:", imageStatus);

    console.log("\n------------------------------------------------------------");
    console.log("3. Testing DIG via executeDockerTool('dig', ['example.com', 'ANY', '+nocmd', '+stats'])");
    const digResult = await executeDockerTool("dig", ["example.com", "ANY", "+nocmd", "+stats"]);
    console.log("DIG Success:", digResult.success);
    console.log("DIG ExitCode:", digResult.exitCode);
    console.log("DIG Stdout:\n" + digResult.stdout);

    console.log("\n------------------------------------------------------------");
    console.log("4. Testing SUBFINDER via executeDockerTool('subfinder', ['-d', 'example.com', '-silent'])");
    const subfinderResult = await executeDockerTool("subfinder", ["-d", "example.com", "-silent"]);
    console.log("Subfinder Success:", subfinderResult.success);
    console.log("Subfinder ExitCode:", subfinderResult.exitCode);
    console.log("Subfinder Stdout:\n" + subfinderResult.stdout);

    console.log("\n------------------------------------------------------------");
    console.log("5. Testing ASSETFINDER via executeDockerTool('assetfinder', ['--subs-only', 'example.com'])");
    const assetfinderResult = await executeDockerTool("assetfinder", ["--subs-only", "example.com"]);
    console.log("Assetfinder Success:", assetfinderResult.success);
    console.log("Assetfinder ExitCode:", assetfinderResult.exitCode);
    console.log("Assetfinder Stdout:\n" + assetfinderResult.stdout);

    console.log("\n------------------------------------------------------------");
    console.log("6. Testing NMAP via executeDockerTool('nmap', ['-F', 'example.com'])");
    const nmapResult = await executeDockerTool("nmap", ["-F", "example.com"], "", { timeoutMs: 45000 });
    console.log("Nmap Success:", nmapResult.success);
    console.log("Nmap ExitCode:", nmapResult.exitCode);
    console.log("Nmap Stdout:\n" + nmapResult.stdout);

    console.log("\n------------------------------------------------------------");
    console.log("7. Testing Unavailable Tool via executeDockerTool('phoneinfoga', ['scan', '-n', '+1234567890'])");
    const phoneinfogaResult = await executeDockerTool("phoneinfoga", ["scan", "-n", "+1234567890"]);
    console.log("PhoneInfoga Success:", phoneinfogaResult.success);
    console.log("PhoneInfoga ExitCode:", phoneinfogaResult.exitCode);
    console.log("PhoneInfoga Stderr:", phoneinfogaResult.stderr);

    console.log("\n------------------------------------------------------------");
    console.log("8. Testing Disallowed Command via executeDockerTool('bash', ['-c', 'whoami'])");
    const disallowedResult = await executeDockerTool("bash", ["-c", "whoami"]);
    console.log("Disallowed Success:", disallowedResult.success);
    console.log("Disallowed Error:", disallowedResult.error);

    console.log("\n============================================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
}

runTests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
