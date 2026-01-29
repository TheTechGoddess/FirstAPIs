const express = require("express");
const postController = require("../controllers/postsController");
const { identifier } = require("../middlewares/identification");

const router = express.Router();

router.get("/all-posts", identifier, postController.getPosts);
router.get("/single-post", identifier, postController.getSinglePosts);
router.post("/create-post", identifier, postController.createPost);
router.put("/update-post", identifier, postController.updatePost);
router.delete("/delete-post", identifier, postController.deletePost);
module.exports = router;
