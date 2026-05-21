// services/appleService.js
const axios = require("axios");
const logger = require("../utils/logger"); // 👈 adjust path if needed

async function getStoreVersion(appId) {
    try {
        logger.info("Fetching App Store version", { appId });

        const url = `https://itunes.apple.com/lookup?id=${appId}`;
        logger.debug("Requesting Apple API", { url });

        const res = await axios.get(url);

        if (!res.data || !res.data.results || res.data.results.length === 0) {
            logger.warn("No app data found from Apple API", { appId });
            return null;
        }

        const version = res.data.results[0].version;

        logger.info("Fetched App Store version successfully", {
            appId,
            version
        });

        return version;

    } catch (error) {
        logger.error("Error fetching App Store version", {
            appId,
            message: error.message,
            stack: error.stack
        });

        throw error; // rethrow so caller can handle
    }
}

module.exports = { getStoreVersion };