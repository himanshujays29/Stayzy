import express from 'express';
import mongoose from 'mongoose';
import Listing from "./models/listing.js";
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


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

//New Route

app.get("/listings/new", (req, res ) => {
    res.render("listings/new.ejs");
})


//Show Route 

app.get ("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create Route

app.post("/listings",async (req, res) => {
   const newListing =  new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

// Edit route 

app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    res.render("listings/edit.ejs", {listing});
});

//Update Route

app.put("/listings/:id",async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

//Delete Route 

app.delete("/listings/:id", async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
});


app.listen(port, ()=>{
    console.log(`Server is listning to port ${port}`); 
});


