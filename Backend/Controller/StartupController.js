const StartUp = require("../Models/StartUp");
const Profile = require("../Models/Profile");

// Create a new startup
const createStartUp = async (req, res) => {
  try {
    const startUp = new StartUp(req.body);
    await startUp.save();

    // Debug logging to check the user ID
    console.log(`User ID for new startup: ${startUp.User}`);

    // Find the profile by User field
    const profile = await Profile.findOne({ User: startUp.User });

    if (profile) {
      // Update the Profile with the new startup ID
      console.log(profile);
      profile.StartUpDetails.push(startUp._id);
      await profile.save();
      console.log(`Profile updated with new startup ID: ${startUp._id}`);
    } else {
      console.log(`Profile not found for user ID: ${startUp.User}`);
    }

    res
      .status(201)
      .json({ success: true, message: "StartUp created successfully!", startUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Startup
const updateStartUp = async (req, res) => {
  const { id } = req.params;
  try {
    const startUp = await StartUp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!startUp) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json({ success: true, message: "Startup updated successfully!", startUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Startup
const deleteStartUp = async (req, res) => {
  const { id } = req.params;
  try {
    const startUp = await StartUp.findByIdAndDelete(id);
    if (!startUp) {
      return res.status(404).json({ message: "Startup not found" });
    }
    // Update the Profile to remove the startup ID
    const updatedProfile = await Profile.findOneAndUpdate(
      { User: startUp.User },
      { $pull: { StartUpDetails: startUp._id } },
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found for the user" });
    }

    res.json({ success: true, message: "Startup deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to fetch all startups
const fetchAllStartUps = async (req, res) => {
  try {
    const startUps = await StartUp.find();
    res.json({ success: true, message: "Startups found", startUps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Controller to fetch a startup by ID
const fetchStartUpByID = async (req, res) => {
  const { id } = req.params;
  try {
    const startUp = await StartUp.findById(id);
    if (!startUp) {
      return res.status(404).json({ message: "Startup not found" });
    }
    res.json({ success: true, message: "Startup found", startUp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStartUp,
  updateStartUp,
  deleteStartUp,
  fetchAllStartUps,
  fetchStartUpByID,
};
