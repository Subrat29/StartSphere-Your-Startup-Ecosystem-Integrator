const express = require("express");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

const {
  createPost,
  updateLikes,
  deletePost,
  addComment,
  fetchAllPosts,
  searchPost,
  updatePost,
  fetchComments,
  fetchLikes,
} = require("../Controller/PostController");

router.post("/createpost/:profileId", protect, createPost);
router.put("/updatepost/:postId", protect, updatePost);
router.delete("/deletepost/:postId",protect, deletePost);
router.put("/likes/:postId", protect, updateLikes);
router.put("/comment/:postId", protect, addComment);
router.get("/all", protect, fetchAllPosts);
router.get("/title", protect, searchPost);
router.get("/comments/:postId", protect, fetchComments); // New route for fetching comments
router.get("/likes/:postId", protect, fetchLikes); // 
module.exports = router;