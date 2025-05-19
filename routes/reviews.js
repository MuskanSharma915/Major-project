const express = require("express");
const router = express.Router({ mergeParams:true});
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { validateReview , isLoggedIn , isReviewAuthor} = require("../middleware.js");
const { review , deleteReview} = require("../controllers/reviews.js");



  
// review route

router.post("/", isLoggedIn , validateReview, wrapAsync(review));


// review delete route

router.delete("/:reviewId", isLoggedIn , isReviewAuthor ,
    wrapAsync(deleteReview)
);

module.exports = router;
