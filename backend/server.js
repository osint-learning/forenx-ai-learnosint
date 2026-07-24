require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dns = require("dns");

const connectDB = require("./config/db");

// Fix MongoDB Atlas DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api", require("./routes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/recon", require("./routes/reconRoutes"));
// Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to ForenX AI LearnOSINT API",
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log(`🚀 Server Running on Port ${PORT}`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("=================================");
});