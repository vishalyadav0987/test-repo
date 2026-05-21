const axios = require("axios");
const logger = require("../utils/logger");

async function getBackendVersion() {
    try {
        logger.info("Fetching backend version");

        const res = await axios.get(
            "https://finzoom.findoc.com/api/version/v1/version",
            { timeout: 8000 }
        );

        const data = res.data?.data?.versions;

        if (!Array.isArray(data)) {
            logger.error("Invalid backend version response structure", {
                response: res.data
            });
            throw new Error("Invalid backend version response");
        }

        const ios = data.find(v => v.platform === "ios");

        if (!ios) {
            logger.error("iOS version not found in backend response", {
                versions: data
            });
            throw new Error("iOS version not found");
        }

        logger.info("Backend version fetched successfully", {
            platform: ios.platform,
            current_version: ios.current_version
        });

        return ios.current_version;

    } catch (error) {
        logger.error("Failed to fetch backend version", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });

        throw error;
    }
}

module.exports = { getBackendVersion };