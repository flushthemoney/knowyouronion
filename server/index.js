const reqData = require("./utils/datareq.js");
const nestData = require("./utils/dataparser.js");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
