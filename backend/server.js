const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const PORT = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

// Handle preflight requests
app.options("*", cors());

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/books", bookRoutes);
app.use("/auth", userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


app.use("/books", bookRoutes);
app.use("/auth", userRoutes);
