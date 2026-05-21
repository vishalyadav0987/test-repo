const axios = require("axios");
const logger = require("../utils/logger"); // 👈 add logger

async function updateVersion(token, payload) {
    try {
        logger.info("Initiating version update request", {
            url: "https://finzoom.findoc.com/api/version/v1/version",
            payload
        });

        const response = await axios.post(
            "https://finzoom.findoc.com/api/version/v1/version",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        logger.info("Version update API success", {
            status: response.status,
            response: response.data
        });

        return response.data;

    } catch (error) {
        logger.error("Version update API failed", {
            message: error.message,
            stack: error.stack,
            status: error.response?.status,
            response: error.response?.data,
            payload
        });

        throw error;
    }
}

module.exports = { updateVersion };