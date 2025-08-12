import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import { reviewSchema } from '../schema.js';
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import Review  from "../models/review.js";


const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//Reviews
//Post Route

router.post("/", validateReview, wrapAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added! ");

    res.redirect(`/listings/${listing._id}`);
    
}));

// Delete review Route 

router.delete("/:reviewID", wrapAsync (async (req,res)=>{
    let {id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewID}});
   await Review.findByIdAndDelete(reviewID);
   req.flash("success", "Review Deleted! ");
   res.redirect(`/listings/${id}`)
}));


export default router;  