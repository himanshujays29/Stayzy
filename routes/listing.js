if(process.env.NODE_ENV != "production"){
   await import ('dotenv/config');
}


import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateAndUploadImage, validateFormFields,validateListing } from "../middleware.js";
import * as listingController from "../controllers/listings.js";

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateAndUploadImage,
    validateFormFields,
    validateListing,
    wrapAsync(listingController.createListing)
  );
  
//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateAndUploadImage,
    validateFormFields,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

export default router;
