const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  Venue: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  Link: {
    type: String,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: function () {
      return !this.isFree;
    },
  },
  Organizer: {
    type: String,
    required: true,
  },
  Speakers: [
    {
      type: String,
      required: true,
    },
  ],
  Attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
