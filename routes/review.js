import express from "express";
const router = express.Router({ mergeParams: true });
import wrapAsync from "../utils/wrapAsync.js";
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";
import * as reviewsController from "../controllers/reviews.js";

//Create Reviews
//Post Route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview)
);

// Delete review Route

router.delete(
  "/:reviewID",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.deleteReview)
);

export default router;
