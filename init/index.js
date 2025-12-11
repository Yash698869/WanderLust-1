const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://yashchourasia6988_db_user:QeWW0avHWZZ88Cza@cluster0.9koqvs6.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";

main()
  .then(() => {
    console.log("connected to DB");
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
