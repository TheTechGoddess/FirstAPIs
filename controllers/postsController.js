const { createPostSchema } = require("../middlewares/validator");
const Post = require("../models/postsModel");

exports.getPosts = async (req, res) => {
  const { page } = req.query;
  const postsPerPage = 10;

  try {
    let pageNum = 0;
    if (page <= 1) {
      pageNum = 0;
    } else {
      pageNum = page - 1;
    }
    const result = await Post.find()
      .sort({ createdAt: -1 })
      .skip(pageNum * postsPerPage)
      .limit(postsPerPage)
      .populate({
        path: "userId",
        select: "email",
      });
    res.status(200).json({ success: true, message: "posts", data: result });
  } catch (error) {}
};
exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user;

  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const result = await Post.create({
      title,
      description,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error) {}
};
exports.getSinglePosts = async (req, res) => {
  const { _id } = req.query;

  try {
    const result = await Post.findOne({ _id }).populate({
      path: "userId",
      select: "email",
    });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "single post", data: result });
  } catch (error) {}
};
exports.updatePost = async (req, res) => {
  const { _id } = req.query;
  const { title, description } = req.body;
  const { userId } = req.user;


  try {
    const { error, value } = createPostSchema.validate({
      title,
      description,
      userId,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingPost = await Post.findOne({ _id });
    if (!existingPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (existingPost.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }
    existingPost.title = title;
    existingPost.description = description;
    const result = await existingPost.save();
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error) {}
};
exports.deletePost = async (req, res) => {
  const { _id } = req.query;
  const { userId } = req.user;


  try {
    const existingPost = await Post.findOne({ _id });
    if (!existingPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (existingPost.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
 await Post.deleteOne({ _id });
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {}
};
