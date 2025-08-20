const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// Store shortened links in-memory (like a DB)
let urls = [];
let id = 1;

// API to shorten a link
app.post("/api/shorten", (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: "URL required" });

  const shortUrl = `http://localhost:5000/${id}`;
  urls.push({ id, originalUrl, shortUrl, clicks: 0 });
  id++;
  res.json({ shortUrl });
});

// Redirect to original URL
app.get("/:id", (req, res) => {
  const url = urls.find(u => u.id == req.params.id);
  if (!url) return res.status(404).json({ error: "Not found" });

  url.clicks++;
  res.redirect(url.originalUrl);
});

// Get stats
app.get("/api/stats", (req, res) => {
  res.json(urls);
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
