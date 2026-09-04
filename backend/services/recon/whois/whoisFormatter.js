function toArray(value) {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value
            .map(item => String(item).trim())
            .filter(Boolean);
    }

    return String(value)
        .split(/\s+/)
        .map(item => item.trim())
        .filter(Boolean);
}


function firstValue(...values) {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return value;
        }
    }

    return "";
}


function formatWhois(data) {
    // Make sure data is actually an object
    if (!data || typeof data !== "object") {
        return {
            registrar: "",
            created: "",
            updated: "",
            expires: "",
            status: [],
            dnssec: "",
            nameServers: [],
            registrant: "",
        };
    }

    return {
        // -----------------------------------------
        // Registrar
        // -----------------------------------------
        registrar: firstValue(
            data.registrar,
            data.Registrar,
            data.registrarName,
            data.RegistrarName
        ),

        // -----------------------------------------
        // Creation Date
        // -----------------------------------------
        created: firstValue(
            data.creationDate,
            data.createdDate,
            data["Creation Date"],
            data.created,
            data.Created
        ),

        // -----------------------------------------
        // Updated Date
        // -----------------------------------------
        updated: firstValue(
            data.updatedDate,
            data["Updated Date"],
            data.updated,
            data.changed,
            data.Changed
        ),

        // -----------------------------------------
        // Expiration Date
        // -----------------------------------------
        expires: firstValue(
            data.registrarRegistrationExpirationDate,
            data.registryExpiryDate,
            data.registryExpirationDate,
            data.expiryDate,
            data.expirationDate,
            data["Registry Expiry Date"],
            data["Registrar Registration Expiration Date"]
        ),

        // -----------------------------------------
        // Domain Status
        // -----------------------------------------
        status: toArray(
            firstValue(
                data.domainStatus,
                data.status,
                data["Domain Status"]
            )
        ),

        // -----------------------------------------
        // DNSSEC
        // -----------------------------------------
        dnssec: firstValue(
            data.dnssec,
            data.DNSSEC,
            data["DNSSEC"]
        ),

        // -----------------------------------------
        // Name Servers
        // -----------------------------------------
        nameServers: toArray(
            firstValue(
                data.nameServer,
                data.nameServers,
                data.nameserver,
                data.nameservers,
                data["Name Server"]
            )
        ),

        // -----------------------------------------
        // Registrant
        // -----------------------------------------
        registrant: firstValue(
            data.registrantOrganization,
            data.registrantName,
            data.registrant,
            data["Registrant Organization"],
            data["Registrant Name"]
        ),
    };
}


module.exports = {
    formatWhois,
};