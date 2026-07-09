const express = require("express");
const axios = require("axios");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    let oceanData = "";

if (
  message.toLowerCase().includes("temperature") ||
  message.toLowerCase().includes("sea") ||
  message.toLowerCase().includes("ocean")
) {
  try {
    const response = await axios.get(
      "https://marine-api.open-meteo.com/v1/marine?latitude=13.0827&longitude=80.2707&hourly=sea_surface_temperature"
    );

    const temp =
      response.data.hourly.sea_surface_temperature[0];

    oceanData = `Current sea surface temperature near Chennai is ${temp}°C.`;
  } catch (err) {
    console.log("Ocean API Error:", err.message);
  }
}

const prompt = `
You are FloatChat, an AI Oceanographic Research Assistant.

Answer questions clearly and scientifically.

Live Ocean Data:
${oceanData}

User Question:
${message}
`;
const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      reply: response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Gemini connection failed.",
    });
  }
});

module.exports = router;