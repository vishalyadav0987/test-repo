const winston = require("winston");

const { combine, timestamp, printf, colorize, errors, align } = winston.format;

// 👇 Custom human-readable format
const prettyFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    let log = `${timestamp} | ${level}: ${message}`;

    // Add metadata if exists
    if (Object.keys(meta).length) {
        log += ` | ${JSON.stringify(meta)}`;
    }

    // Show stack trace if error
    if (stack) {
        log += `\n${stack}`;
    }

    return log;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",

    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }) // 👈 enables stack trace logging
    ),

    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }), // 👈 colors
                align(),
                prettyFormat
            )
        })
    ]
});

module.exports = logger;