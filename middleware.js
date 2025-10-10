import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { listingSchema, reviewSchema } from "./schema.js";
import ExpressError from "./utils/ExpressError.js";
import { cloudinary } from "./cloudConfig.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged In First.");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export const validateAndUploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files["listing[image]"]) {
      req.flash("error", "No file uploaded!");
      return res.redirect("/listings/new");
    }

    const file = req.files["listing[image]"];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.mimetype)) {
      req.flash("error", "Invalid file type! Only JPG, JPEG, PNG allowed.");
      return res.redirect("/listings/new");
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "Stayzy_DEV",
    });

    req.cloudinaryResult = result;
    next(); 
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while uploading the image.");
    return res.redirect("/listings/new");
  }
};

export const validateFormFields = (req, res, next) => {
  req.body = {
    listing: {
      title: req.body["listing[title]"],
      description: req.body["listing[description]"],
      price: req.body["listing[price]"],
      location: req.body["listing[location]"],
      country: req.body["listing[country]"],
    },
  };
  next();
};

export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const isReviewAuthor = async (req, res, next) => {
  let { id, reviewID } = req.params;
  let review = await Review.findById(reviewID);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the Author of this Review!.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
