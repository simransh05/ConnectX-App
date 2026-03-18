const Post = require("../models/post");
const User = require('../models/user');
const Comment = require('../models/comment')
const Notification = require('../models/notification')
const { formatPost } = require("./Users/format");

module.exports.getIndividualPosts = async (req, res) => {
    const { userId, skip } = req.params;
    try {
        let posts = await Post.find({ userId }).sort({ createdAt: -1 }).populate('userId').skip(skip).limit(5);
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
        // console.log('here 23')
        let posts = await Post.find().populate('userId');
        // console.log('posts 25', posts)
        if (!posts) {
            return res.status(200).json([])
        }
        posts = posts.reverse();
        return res.status(200).json(posts.map(formatPost))
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

module.exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    // console.log(postId)
    try {
        await Post.deleteOne({
            _id: postId
        })
        await User.updateMany(
            { savedPost: postId },
            { $pull: { savedPost: postId } }
        )
        await Comment.deleteMany({
            postId
        })
        await Notification.deleteMany({
            postId
        })
        return res.status(200).json({ message: 'Success' })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postUploadPost = async (req, res) => {
    const { caption, userId, fileType, postType } = req.body;
    console.log('post upload', caption, userId, fileType, postType)
    try {
        const allData = {
            caption,
            userId,
            fileType,
            postType
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

module.exports.postLike = async (postId, userId) => {
    try {
        const updated = await Post.findOneAndUpdate(
            {
                _id: postId,
                likes: { $ne: userId }
            },
            {
                $push: { likes: userId },
                $inc: { likeCount: 1 }
            },
            { new: true }
        );

        return updated;
    } catch (err) {
        console.error(err.message);
    }
};

module.exports.getSavedPost = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate({
            path: "savedPost",
            populate: {
                path: "userId"
            }
        });
        const posts = user.savedPost;
        // console.log('populated current user posts', posts);
        return res.status(200).json(posts.map(formatPost));
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}