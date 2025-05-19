const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  
  };

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"  } , }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , ".." , filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  }





module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
  }


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
  
    // Step 1: Update basic fields
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
    // Step 2: If there's a new image, update it
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
  
      await listing.save(); // Save the updated image
    }
  
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  };
  
// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   }

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
  }