const Post = require("../models/post");

module.exports.getMyPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ userId }).populate('likes');
        if (!posts) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('likes userId');
        if (!posts) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}