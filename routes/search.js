// routes/search.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing'); 

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    // Blank search = show all listings
    if (!q) {
      const all = await Listing.find().limit(100);
      return res.render('listings', { allListings: all, q: '' });
    }

    const safe = escapeRegex(q);
    const reg = new RegExp(safe, 'i');

    const results = await Listing.find({
      $or: [
        { location: reg },   // because your EJS uses listing.location
        { country: reg },
        { title: reg }
      ]
    }).limit(200);

    res.render('listings', { allListings: results, q });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
