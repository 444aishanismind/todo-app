const mongoose = require("mongoose");

const connectionUrl =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todoDb";

const connectMongodb = async () => {
  try {
    await mongoose.connect(connectionUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectMongodb;