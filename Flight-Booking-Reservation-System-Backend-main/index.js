const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

// Constants
const app = express();
dotenv.config();
const port = process.env.PORT || 3001;

// ------------------ CORS FIX ------------------
const allowedOrigins = [
  "https://flight-booking-a4hq.vercel.app", // YOUR FRONTEND ON VERCEL
  "http://localhost:4200" // for local testing
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// ------------------ MIDDLEWARE ------------------
app.use(express.json());

// ------------------ DATABASE CONNECTION ------------------
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ------------------ ROUTES ------------------
const authroute = require("./routes/auth");
const userroute = require("./routes/user");
const flightroute = require("./routes/flight");

const { authenticateToken } = require("./helpingfunctions/jwt");

app.use("/auth", authroute);
app.use("/user", authenticateToken, userroute);
app.use("/flight", authenticateToken, flightroute);

// Base Route
app.get("/", (req, res) => {
  res.json({ msg: "Backend is running!" });
});

// ------------------ START SERVER ------------------
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
