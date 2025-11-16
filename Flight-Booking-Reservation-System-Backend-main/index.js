const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const uuid = require("uuid");

// Constants
const app = express();
const port = process.env.PORT || 3001;

// Config
dotenv.config();

// 🔥 CORS FIX (Frontend URL added)
app.use(cors({
  origin: "https://flight-booking-a4hq.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options("*", cors());

// Body Parser
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connecting", () => {
  console.log("connecting to MongoDB...");
});

db.on("error", (error) => {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});

db.on("connected", () => {
  console.log("MongoDB connected!");
});

db.once("open", () => {
  console.log("MongoDB connection opened!");
});

db.on("reconnected", () => {
  console.log("MongoDB reconnected!");
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected!");
  mongoose.connect(process.env.MONGODB_URL, {
    server: { auto_reconnect: true },
  });
});

mongoose.connect(process.env.MONGODB_URL, { 
  server: { auto_reconnect: true } 
});

// Components
const authroute = require("./routes/auth");
const userroute = require("./routes/user");
const flightroute = require("./routes/flight");

const { authenticateToken } = require("./helpingfunctions/jwt");

// Routes
app.use("/auth", authroute);
app.use("/user", authenticateToken, userroute);
app.use("/flight", authenticateToken, flightroute);

app.get("/", (req, res) => {
  res.json({ msg: "Base path for API" });
});

// Starting
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
