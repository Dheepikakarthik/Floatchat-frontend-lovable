const axios = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
const chatRoutes = require("./chat");
app.use(cors());
app.use(express.json());


app.use("/api/chat", chatRoutes);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FloatChat Backend Running" });
});
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend connected to backend!"
  });
});
app.get("/api/chat-test", (req, res) => {
  res.json({
    reply: "Backend chat route is working!",
  });
});
app.get("/api/argo-floats", async (req, res) => {
  try {
    const floats = [
  {
    id: "ARGO-1",
    lat: 12.5,
    lon: 80.2,
    status: "active",
    temp: 28.1,
  },
  {
    id: "ARGO-2",
    lat: -25.3,
    lon: 145.7,
    status: "active",
    temp: 22.4,
  },
  {
    id: "ARGO-3",
    lat: 40.8,
    lon: -30.1,
    status: "active",
    temp: 17.6,
  },
];

res.json(floats);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to fetch ARGO data",
    });
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});