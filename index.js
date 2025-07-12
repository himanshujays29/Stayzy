import express from 'express';
import mongoose from 'mongoose';
import Listing from "./models/listing.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));


const MONGO_URL = "mongodb://127.0.0.1:27017/Stayzy";

main().then((res)=>{
    console.log("Connected to DB");
}) .catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.get("/", (req, res)=>{
    res.send("Server is Runing");
});

// Test Listing

/*
app.get("/testListing",async (req, res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Sample was Saved");
    res.send("Sucessful Testing");
});

*/

//Index Route 

app.get("/listings", async (req, res) => {
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});

//Show Route 

app.get ("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.listen(port, ()=>{
    console.log(`Server is listning to port ${port}`); 
});
