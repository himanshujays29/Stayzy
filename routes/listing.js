import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { isLoggedIn, isOwner, validateListing } from '../middleware.js';



 
//Index Route 

// router.get("/", wrapAsync(async (req, res) => {
//    const allListings = await Listing.find({});
//    const totalCount = await Listing.countDocuments(); 
//    res.render("listings/index.ejs", {allListings, totalCount});
// }));

router.get("/", wrapAsync(async (req, res) => {
   const { search, sort } = req.query;

   let query = {};
   if (search) {
      query.$or = [
         { title: { $regex: search, $options: "i" } },
         { location: { $regex: search, $options: "i" } },
         { country: { $regex: search, $options: "i" } }
      ];
   }

   let sortOption = {};
   if (sort === "low") sortOption.price = 1;
   if (sort === "high") sortOption.price = -1;
   if (sort === "rated") sortOption.rating = -1;

   const allListings = await Listing.find(query).sort(sortOption);
   const totalCount = await Listing.countDocuments(query);


   res.render("listings/index.ejs", { 
      allListings, 
      totalCount,
      search,   
      sort      
   });
}));


//New Route

router.get("/new", isLoggedIn, (req, res ) => {
    res.render("listings/new.ejs");
})


//Show Route 

router.get ("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews", 
            populate: {
                path: "author",
            }})
        .populate("owner");

    if(!listing){
        req.flash("error", "Listing you Requestd for Does not Exist..!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//Create Route

router.post("/", isLoggedIn, validateListing, wrapAsync( async (req, res, next) => {
    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
   
}));

// Edit route 

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error", "Listing you Requestd for Does not Exist..!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Route 

router.put("/:id", isLoggedIn, isOwner, validateListing,wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route 

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
}));

export default router;

