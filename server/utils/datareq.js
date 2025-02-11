const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

async function reqData() {
  try {
    const apiUrl = `${process.env.URL}`;

    const response = await axios.get(apiUrl);

    const jsonData = response.data;

    const records = jsonData.records || [];

    const jsonString = JSON.stringify(records, null, 2);
    const filePath = "./data/data.json";

    fs.writeFile(filePath, jsonString, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("JSON data saved to", filePath);
      }
    });
  } catch (error) {
    console.error("Error fetching or saving data:", error);
    if (error.response) {
      console.error("Response Error Data:", error.response.data);
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Setup Error:", error.message);
    }
  }
}

module.exports = reqData;
