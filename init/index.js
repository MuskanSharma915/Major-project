const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";  

main()
  .then(() => {
   console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });   

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj , owner : '680d027baa01282eab46367a'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDb();