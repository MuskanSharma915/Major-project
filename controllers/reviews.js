const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");


module.exports.review = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New review created!");
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {

    let { id, reviewId } = req.params;
    console.log(id, reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    req.flash("success" , "Review deleted!");
    res.redirect(`/listings/${id}`);
};