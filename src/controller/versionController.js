const logger = require("../utils/logger");

const { getStoreVersion } = require("../services/appleService");
const { getBackendVersion } = require("../services/versionService");
const { generateToken } = require("../services/authService");
const { updateVersion } = require("../services/updateService");

function splitVersion(v) {
    try {
        const [semver, build] = v.split("+");
        return {
            semver: semver || "0.0.0",
            build: parseInt(build || 0)
        };
    } catch (error) {
        logger.error("Version parsing failed", { version: v, error: error.message });
        return { semver: "0.0.0", build: 0 };
    }
}

async function checkUpdate(req, res) {
    const startTime = Date.now();

    try {
        logger.info("Check update triggered");

        // 1. Fetch versions
        const storeVersion = await getStoreVersion("6757949330");
        const backendVersion = await getBackendVersion();

        logger.info("Versions fetched", {
            storeVersion,
            backendVersion
        });

        const store = splitVersion(storeVersion);
        const backend = splitVersion(backendVersion);

        logger.debug("Parsed versions", { store, backend });

        // 2. Already up-to-date
        if (store.semver === backend.semver) {
            logger.info("No update required - versions match", {
                version: store.semver
            });

            return res.json({
                success: true,
                status: "updated",

                app: {
                    name: "FinZoom",
                    platform: "ios",
                    appId: process.env.APPLE_APP_ID,
                },

                versions: {
                    storeVersion,
                    backendVersion,
                    newVersion: backendVersion
                },

                message: "Version updated successfully"
            });
        }

        // 3. Generate token
        const token = await generateToken();

        logger.info("Auth token generated for update flow");

        // 4. Build new version
        const newVersion = `${store.semver}+${backend.build + 1}`;

        logger.info("New version calculated", {
            newVersion
        });

        // 5. Push update
        const payload = {
            platform: "ios",
            current_version: newVersion,
            last_stable_version: backendVersion
        };

        const updateResponse = await updateVersion(token, payload);

        logger.info("Update API success", {
            response: updateResponse
        });

        return res.json({
            success: true,
            newVersion,

            app: {
                name: "FinZoom",
                platform: "ios",
                appId: process.env.APPLE_APP_ID,
            },

            versions: {
                storeVersion,
                backendVersion,
                backendBuild,
                newVersion
            },

            status: store.semver !== backend.semver ? "updated" : "no-change"
        });

    } catch (err) {
        logger.error("checkUpdate failed", {
            message: err.message,
            stack: err.stack,
            response: err.response?.data
        });

        return res.status(500).json({
            success: false,
            error: err.message
        });

    } finally {
        logger.info("checkUpdate execution completed", {
            duration_ms: Date.now() - startTime
        });
    }
}

module.exports = { checkUpdate };