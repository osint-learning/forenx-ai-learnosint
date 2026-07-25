const { getWhois } = require("./whoisService");

(async () => {
    const result = await getWhois("github.com");
    console.log(result);
})();