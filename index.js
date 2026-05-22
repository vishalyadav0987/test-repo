const express = require("express");
const { checkUpdate } = require("./src/controller/versionController");

const app = express();

const cron = require("node-cron");
const axios = require("axios");

cron.schedule("*/5 * * * *", async () => {
    try {
        console.log("Running version check...");

        const response = await axios.get("http://localhost:3000/health");

        console.log("Cron API response:", response.data);

    } catch (err) {
        console.error("Cron error:", err.message);
    }
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
});

app.get("/checking-route",(req,res)=>{
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
    res.write("Checking another chekcing another change");
})

app.get("/adding-test",(req,res)=>{
    res.json({
        status: "ok",
        time: new Date().toISOString()
    });
    res.write("Changing Test");
})

app.get("/check-ios-update", checkUpdate);

app.listen(3000, () => console.log("Server running"));