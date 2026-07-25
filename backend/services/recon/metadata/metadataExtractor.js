const { URL } = require("url");

/**
 * Get meta tag content safely
 */
function getMetaContent($, selector) {
    return $(selector).attr("content")?.trim() || "";
}

/**
 * Convert relative URL to absolute URL
 */
function resolveUrl(baseUrl, value) {
    if (!value) return "";

    try {
        return new URL(value, baseUrl).href;
    } catch {
        return value;
    }
}

/**
 * Extract basic metadata
 */
function extractBasicMetadata($, url) {
    return {
        title:
            getMetaContent($, 'meta[property="og:title"]') ||
            $("title").text().trim(),

        description: getMetaContent(
            $,
            'meta[name="description"]'
        ),

        keywords: getMetaContent(
            $,
            'meta[name="keywords"]'
        ),

        author: getMetaContent(
            $,
            'meta[name="author"]'
        ),

        generator: getMetaContent(
            $,
            'meta[name="generator"]'
        ),

        language:
            $("html").attr("lang") ||
            getMetaContent($, 'meta[http-equiv="content-language"]'),

        canonical: resolveUrl(
            url,
            $('link[rel="canonical"]').attr("href")
        ),

        robots: getMetaContent(
            $,
            'meta[name="robots"]'
        ),

        viewport: getMetaContent(
            $,
            'meta[name="viewport"]'
        ),

        themeColor: getMetaContent(
            $,
            'meta[name="theme-color"]'
        ),

        favicon: resolveUrl(
            url,
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href") ||
            "/favicon.ico"
        ),
    };
}

/**
 * Extract Open Graph metadata
 */
function extractOpenGraph($) {
    return {
        title: getMetaContent($, 'meta[property="og:title"]'),

        description: getMetaContent(
            $,
            'meta[property="og:description"]'
        ),

        image: getMetaContent(
            $,
            'meta[property="og:image"]'
        ),

        url: getMetaContent(
            $,
            'meta[property="og:url"]'
        ),

        type: getMetaContent(
            $,
            'meta[property="og:type"]'
        ),

        site_name: getMetaContent(
            $,
            'meta[property="og:site_name"]'
        ),
    };
}

/**
 * Extract Twitter Card metadata
 */
function extractTwitterCard($) {
    return {
        card: getMetaContent(
            $,
            'meta[name="twitter:card"]'
        ),

        title: getMetaContent(
            $,
            'meta[name="twitter:title"]'
        ),

        description: getMetaContent(
            $,
            'meta[name="twitter:description"]'
        ),

        image: getMetaContent(
            $,
            'meta[name="twitter:image"]'
        ),
    };
}

module.exports = {
    extractBasicMetadata,
    extractOpenGraph,
    extractTwitterCard,
};