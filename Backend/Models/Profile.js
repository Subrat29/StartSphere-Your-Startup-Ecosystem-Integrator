const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Bio: { type: String, trim: true },
    Role: { type: String },
    TotalRevenue: [
      {
        InverstedInCompanies: { type: Number },
        InvestedMoney: { type: Number },
        Date: { type: Date, default: Date.now },
      },
    ],
    Image: { type: String },
    ContactInformation: {
      CompanyEmail: { type: String, trim: true },
      Phone: { type: String },
      LinkedInProfile: { type: String },
      CompanyWebsite: { type: String },
      OfficeAddress: { type: String, trim: true },
    },
    Experience: { type: String },
    MyMentors:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
    ],
    StartUpDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "StartUp",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
