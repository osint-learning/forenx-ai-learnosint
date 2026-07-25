function toArray(value) {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    return value
        .split(/\s+/)
        .map(item => item.trim())
        .filter(Boolean);
}
function formatWhois(data) {
    return {
        registrar:
            data.registrar ||
            data.Registrar ||
            "",

        created:
            data.creationDate ||
            data.createdDate ||
            data["Creation Date"] ||
            "",

        updated:
            data.updatedDate ||
            data["Updated Date"] ||
            "",

        expires:
            data.registryExpiryDate ||
            data.expiryDate ||
            data["Registry Expiry Date"] ||
            "",

        status: toArray(
            data.domainStatus ||
            data.status
        ),

        dnssec:
            data.dnssec ||
            "",

        nameServers: toArray(
            data.nameServer ||
            data.nameServers
        ),

        registrant:
            data.registrantOrganization ||
            data.registrant ||
            "",
    };
}

module.exports = {
    formatWhois,
};