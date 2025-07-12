import mongoose from 'mongoose';
import initData from "./data.js";
import Listing from "../models/listing.js";



const MONGO_URL = "mongodb://127.0.0.1:27017/Stayzy";

main().then((res)=>{
    console.log("Connected to DB");
}) .catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
   await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();