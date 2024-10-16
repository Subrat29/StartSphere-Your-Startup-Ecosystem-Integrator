const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const {
  createStartUp,
  updateStartUp,
  deleteStartUp,
  fetchAllStartUps,
  fetchStartUpByID,
} = require("../Controller/StartupController");
router.route("/create").post(protect, createStartUp);
router.route("/update/:id").put(protect, updateStartUp);
router.route("/delete/:id").delete(protect, deleteStartUp);
router.route("/all").get(fetchAllStartUps);
router.route("/:id").get(fetchStartUpByID);
module.exports = router;
