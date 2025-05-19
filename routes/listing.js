const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing  } = require("../middleware.js");
const { index , renderNewForm , showListing , createListing , editListing ,updateListing, deleteListing } = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });






//  index route

router.get("/", wrapAsync(index));


// Search Route - Location-based filtering
router.get("/search", async (req, res) => {
  const { location } = req.query;

  try {
    const allListings = await Listing.find({
      location: { $regex: location, $options: "i" } // Case-insensitive match
    });

    res.render("listings/index", { allListings });
  } catch (err) {
    console.error(err);
    res.redirect("/listings");
  }
});


// new route

router.get("/new", isLoggedIn, renderNewForm );

// show route

router.get("/:id", wrapAsync(showListing));



//Create Route
// router.post(
//   "/",
//   isLoggedIn,
//   upload.single('listing[image]'),
//   (req, res, next) => {
//     if (req.file) {
//       req.body.listing.image = {
//         url: req.file.path
//       };
//     }
//     next();
//   },
//   validateListing,
//   wrapAsync(createListing)
// );
router.post(
  "/",
  isLoggedIn,
  upload.single('listing[image]'),
  (req, res, next) => {
    if (req.file) {
      req.body.listing.image = {
        url: req.file.path,
        filename: req.file.filename // ✅ Fixes the Joi validation error
      };
    }
    next();
  },
  validateListing,
  wrapAsync(createListing)
);



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));


//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"), // handles file input
  (req, res, next) => {
    // If a file is uploaded, attach it to the body in the required object format
    if (req.file) {
      req.body.listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }
    next(); // proceed to validation and controller
  },
  validateListing,
  wrapAsync(updateListing)
);
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));


//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;


