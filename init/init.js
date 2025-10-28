import mongoose from "mongoose";
import initData from "./data.js";
import Listing from "../models/listing.js";
import { geocode } from "../public/JS/geocode.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/Stayzy";

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//    await Listing.deleteMany({});
//    initData.data = initData.data.map((obj) =>({...obj, owner: "68e1526eea6c8f583718a18a"}));
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized");
// };

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old data deleted");

  for (const item of initData.data) {
    try {
      const locationString = `${item.location}, ${item.country}`;
      const geoData = await geocode(locationString);
      if (!geoData) {
        console.warn(`Skipping ${item.title} (no geocode data)`);
        continue;
      }
      const geometry = {
        type: "Point",
        coordinates: [geoData.lon, geoData.lat],
      };
      const listing = new Listing({
        ...item,
        owner: "68dcd5d0670eb8a9adf6eb2e",
        geometry,
      });
      await listing.save();
    } catch (err) {
      console.error(`Error with "${item.title}": ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("Database initialized successfully!");
  mongoose.connection.close();
};

initDB();
