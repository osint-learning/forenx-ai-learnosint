const { formatWhois } = require("./whoisFormatter");

function parseWhois(data) {
    return formatWhois(data);
}

module.exports = {
    parseWhois,
};