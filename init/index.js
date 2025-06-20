const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  // ✅ Convert string to ObjectId
  const ownerId = new mongoose.Types.ObjectId("684a9c9afda4f673ed937dbc");

  initData.data = initData.data.map((obj) => {
    return { ...obj, owner: ownerId };
  });

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
