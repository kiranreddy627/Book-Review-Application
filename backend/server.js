const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


const uri = process.env.ATLAS_URI;

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


app.use("/books", bookRoutes);
app.use("/auth", userRoutes);
