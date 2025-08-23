// server.js — serve built app without Vite preview/allowedHosts
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const dist = path.join(__dirname, "dist");

app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(PORT, () => console.log("Frontend running on", PORT));
