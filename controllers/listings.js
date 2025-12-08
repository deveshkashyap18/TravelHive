const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
  // read query params
  const q = req.query.q ? req.query.q.trim() : "";
  const category = req.query.category ? req.query.category.trim() : "";

  // build filter
  const filter = {};

  // category filter (exact match)
  if (category) {
    filter.category = category;
  }

  // text search filter (title OR location OR country)
  if (q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const reg = new RegExp(safe, 'i');
    filter.$or = [
      { title: reg },
      { location: reg },
      { country: reg }
    ];
  }

  // fetch results
  const allListings = await Listing.find(filter);

  // render with q and category so template can show messages / active states
  res.render("./listings/index.ejs", { allListings, q, category });
};


module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs")
}

module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Requested listing does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing})
}

module.exports.createListing = async (req,res,next)=>{
    let responce = await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url, filename};
    newListing.geometry = responce.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Requested listing does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings")
}