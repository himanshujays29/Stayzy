import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review  from "../models/review.js";
import {validateReview, isLoggedIn, isReviewAuthor} from '../middleware.js';

//Reviews
//Post Route

router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added! ");

    res.redirect(`/listings/${listing._id}`);
    
}));

// Delete review Route 

router.delete("/:reviewID", isLoggedIn, isReviewAuthor, wrapAsync (async (req,res)=>{
    let {id, reviewID} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewID}});
   await Review.findByIdAndDelete(reviewID);
   req.flash("success", "Review Deleted! ");
   res.redirect(`/listings/${id}`)
}));


export default router;  