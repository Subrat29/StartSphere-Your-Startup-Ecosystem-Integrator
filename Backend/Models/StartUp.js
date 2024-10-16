const mongoose = require("mongoose");

const startUpSchema = mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  StartUpName: { type: String, required: true },
  Logo: { type: String, required: true },
  FounderName: { type: String, required: true },
  CompanyDes: { type: String, required: true, trim: true },
  FoundingYear: { type: Number, required: true },
  Growth: [
    {
      Revenue: { type: Number, required: true },
      Year: { type: Number, required: true },
    },
  ],
  NumberOfEmployees: { type: Number, required: true },
  TargetMarket: { type: String, required: true },
  CurrentStage: { type: String, required: true },
  KeyFeatures: { type: String, required: true },
  Investors: { type: String, required: true },
  Evaluation: { type: Number, required: true },
  Revenue: { type: Number, required: true },
  FundingRaised: [
    {
      CompanyName: { type: String, required: true },
      EquityHolds: { type: Number, required: true },
      Amount: { type: Number, required: true },
    },
  ],
  ContactInformation: {
    CompanyEmail: { type: String, trim: true },
    Phone: { type: String },
    LinkedInProfile: { type: String },
    CompanyWebsite: { type: String },
    OfficeAddress: { type: String, trim: true },
  },
});

const StartUp = mongoose.model("StartUp", startUpSchema);
module.exports = StartUp;
