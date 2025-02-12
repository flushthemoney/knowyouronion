const reqData = require("./utils/datareq.js");
const nestData = require("./utils/dataparser.js");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
const dataPath = path.join(__dirname, "./data/nested_data.json");

app.get("/", (req, res) => {
  try {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading JSON file:", err);
        res.status(500).json({ error: "Failed to read data" });
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).json({ error: "Invalid JSON format" });
      }
    });
  } catch (error) {
    console.error("General error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
