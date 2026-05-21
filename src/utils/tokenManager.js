// utils/tokenManager.js
let cachedToken = null;
let createdAt = null;

const TTL = 15 * 60 * 1000;

function isValid() {
    return cachedToken && createdAt && (Date.now() - createdAt < TTL);
}

function setToken(token) {
    cachedToken = token;
    createdAt = Date.now();
}

function getToken() {
    return cachedToken;
}

module.exports = {
    isValid,
    setToken,
    getToken
};