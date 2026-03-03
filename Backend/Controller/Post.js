const Post = require("../models/post");
const { formatPost } = require("./Users/format");

module.exports.getIndividualPosts = async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.find({ userId }).populate('likes userId');
        if (!posts) {
            return res.status(200).json([])
        }
        // console.log(posts);
        return res.status(200).json(posts.map(formatPost))
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('likes userId');
        // console.log('posts 34', posts)
        if (!posts) {
            return res.status(200).json([])
        }
        return res.status(200).json(posts.map(formatPost))
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postUploadPost = async (req, res) => {
    const { caption, userId } = req.body;
    // console.log(caption, userId)
    try {
        const allData = {
            caption,
            userId
        }
        if (req.file) {
            allData.photoVideo = req.file.buffer;
        }
        // console.log(allData)
        await Post.create(allData)
        return res.status(200).json({ message: 'Successful' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}