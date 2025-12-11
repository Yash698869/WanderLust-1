const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to PC");
  })
  .catch((err) => {
    console.log("❌ Connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({}); // deleting all data first that is in DB
    console.log("🗑  Old data deleted!");

    await Listing.insertMany(initData.data); //object.data => data is from data.js export func
    console.log("✅ Data initialized successfully!");
    console.log("Data was initialized...");
  } catch (err) {
    console.log("❌ Error inserting data:", err);
  }
};

initDB();
