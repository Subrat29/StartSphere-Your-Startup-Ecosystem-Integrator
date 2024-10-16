const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoose connected:`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit();
  }
};
module.exports = connectDB;
