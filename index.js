const express = require("express");
const http = require("http");
const { chromium } = require("playwright");
const { WebSocketServer } = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    const comm = JSON.parse(message);
    if (comm.type === "takeScreenshot") {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto("https://www.google.co.in/webhp");
      await page.screenshot({ path: "screenshot.png" });
      await browser.close();
      ws.send(JSON.stringify({ status: "Success", message: "Taken" }));
    }
  });
});

server.listen("5000", () => {
  console.log("running on http://localhost:5000");
});
