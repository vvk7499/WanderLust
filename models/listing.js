const mongoose = require("mongoose");
const Schema = mongoose.Schema; // <-- this is the missing line
const Review = require("./review.js")
const listingSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    filename: String,
    url: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
owner: {
  type: Schema.Types.ObjectId,
  ref: "User",
},
category: {
  type: String,
  enum: ['Rooms', 'Mountains', 'Farm', 'Beach', 'Castles', 'Camping', 'Arctic', 'Domes', 'Boats', 'Iconic Cities', 'Trending'],
  required: true,
}

});
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id: { $in: listing.reviews} });
  }
  });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
