import Listing from "../models/listing.js";
import { geocode } from "../public/JS/geocode.js";

export const index = async (req, res) => {
  const { search, sort } = req.query;

  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
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
    sort,
  });
};

export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

export const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you Requestd for Does not Exist..!");
    return res.redirect("/listings");
  }

  let avgRating = 0;
  if (listing.reviews.length > 0) {
    const total = listing.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    avgRating = Math.round(total / listing.reviews.length);
  }

  res.render("listings/show.ejs", { listing, avgRating });
};

export const createListing = async (req, res, next) => {
  const location = await geocode(
    `${req.body.listing.location}, ${req.body.listing.country}`
  );

  if (!location) {
    req.flash(
      "error",
      "Location not found. Please try again with a valid address."
    );
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  const cloudResult = req.cloudinaryResult;
  let url = cloudResult.secure_url;
  let filename = cloudResult.public_id;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = {
    type: "Point",
    coordinates: [location.lon, location.lat],
  };
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

export const renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you Requestd for Does not Exist..!");
    return res.redirect("/listings");
  }
  let orignalImageUrl = listing.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

export const updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.cloudinaryResult !== "undefined") {
    const cloudResult = req.cloudinaryResult;
    let url = cloudResult.secure_url;
    let filename = cloudResult.public_id;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

export const deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
