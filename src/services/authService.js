// services/authService.js
const axios = require("axios");
const logger = require("../utils/logger"); // 👈 add logger
const tokenManager = require("../utils/tokenManager");

async function generateToken() {
    try {
        if (tokenManager.isValid()) {
            logger.info("Using cached token");
            return tokenManager.getToken();
        }

        logger.info("Token expired or missing, generating new token");

        // STEP 1: OTP LOGIN
        logger.debug("Calling password login API");

        const otpRes = await axios.post(
            `${process.env.BASE_URL}/auth/v1/login/password`,
            {
                device_name: "server",
                email: process.env.EMAIL,
                password: process.env.PASSWORD
            }
        );

        if (!otpRes.data?.otp_access_token) {
            logger.error("OTP token missing in response", {
                response: otpRes.data
            });
            throw new Error("OTP token generation failed");
        }

        const otpToken = otpRes.data.otp_access_token;

        logger.info("OTP token received successfully");

        // STEP 2: MPIN LOGIN
        logger.debug("Calling MPIN login API");

        const mpinRes = await axios.post(
            `${process.env.BASE_URL}/auth/v1/login/mpin`,
            {
                device_name: "server",
                mpin: process.env.MPIN
            },
            {
                headers: {
                    Authorization: `Bearer ${otpToken}`
                }
            }
        );

        if (!mpinRes.data?.access_token) {
            logger.error("Access token missing in MPIN response", {
                response: mpinRes.data
            });
            throw new Error("MPIN login failed");
        }

        const accessToken = mpinRes.data.access_token;

        tokenManager.setToken(accessToken);

        logger.info("Token generated and stored successfully");

        return accessToken;

    } catch (error) {
        logger.error("Auth service failed while generating token", {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });

        throw error;
    }
}

module.exports = { generateToken };