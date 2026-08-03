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
  const title =
    $("title").text().trim() ||
    getMetaContent($, 'meta[property="og:title"]');

const description =
    getMetaContent($, 'meta[name="description"]') ||
    getMetaContent($, 'meta[property="og:description"]');

const keywords =
    getMetaContent($, 'meta[name="keywords"]');

const author =
    getMetaContent($, 'meta[name="author"]');

const generator =
    getMetaContent($, 'meta[name="generator"]');

const publisher =
    getMetaContent($, 'meta[name="publisher"]');

const copyright =
    getMetaContent($, 'meta[name="copyright"]');

const charset =
    $("meta[charset]").attr("charset") ||
    "";

const language =
    $("html").attr("lang") ||
    getMetaContent($, 'meta[http-equiv="content-language"]');

const viewport =
    getMetaContent($, 'meta[name="viewport"]');

const robots =
    getMetaContent($, 'meta[name="robots"]');

const themeColor =
    getMetaContent($, 'meta[name="theme-color"]');

const canonical =
    resolveUrl(
        url,
        $('link[rel="canonical"]').attr("href")
    );

const favicon =
    resolveUrl(
        url,
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href") ||
        "/favicon.ico"
    );

const manifest =
    resolveUrl(
        url,
        $('link[rel="manifest"]').attr("href")
    );

const rss =
    resolveUrl(
        url,
        $('link[type="application/rss+xml"]').attr("href")
    );

return {

    title,

    description,

    keywords,

    author,

    generator,

    publisher,

    copyright,

    charset,

    language,

    viewport,

    robots,

    themeColor,

    canonical,

    favicon,

    manifest,

    rss

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