const Post = require("../models/post");
const User = require('../models/user');
const Comment = require('../models/comment')
const Notification = require('../models/notification')
const { formatPost } = require("./Users/format");
const Follow = require("../models/follow");
const jwt = require('jsonwebtoken');

module.exports.getIndividualPosts = async (req, res) => {
    const { userId, skip } = req.params;
    const token = req.cookies.token;
    try {
        let posts;
        if (!token) {
            posts = await Post.find({
                $and: [
                    { userId },
                    { postType: 'public' }
                ]
            }).sort({ _id: -1 }).skip(skip).limit(5).populate('userId');
        } else {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            const currentUser = await User.findOne({ email: user.email })
            // console.log(currentUser?._id.toString(), userId)
            const isFollow = await Follow.findOne({
                follower: currentUser?._id,
                following: userId
            })
            if (currentUser?._id.equals(userId) || isFollow) {
                // console.log('me follow', isFollow)
                posts = await Post.find({ userId }).sort({ _id: -1 }).skip(skip).limit(5).populate('userId');
            } else {
                // console.log('non follow')
                posts = await Post.find({
                    $and: [
                        { userId },
                        { postType: 'public' }
                    ]
                }).sort({ _id: -1 }).skip(skip).limit(5).populate('userId');
            }
        }
        // console.log('after')
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
    const { skip } = req.params;
    const token = req.cookies.token;

    try {
        if (!token) {
            const posts = await Post.find({ postType: 'public' })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(5)
                .populate("userId")
            return res.status(200).json(posts.map(formatPost))
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findOne({
            email: user.email
        });

        const following = await Follow.find({
            follower: currentUser._id
        });

        const followingIds = following.map(f => f.following);

        const posts = await Post.find({
            $or: [
                { userId: { $in: followingIds } },
                { userId: currentUser._id },
                { postType: "public" }
            ]
        })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(5)
            .populate("userId");

        return res.status(200).json(
            posts.map(formatPost)
        );

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};

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
    // console.log('post upload', caption, userId, fileType, postType)
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
        if (!allData.photoVideo && !allData.caption) {
            return res.status(404).json({ message: 'any field required' })
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
            { returnDocument: 'after' }
        );

        return updated;
    } catch (err) {
        console.error(err.message);
    }
};

module.exports.deleteLike = async (postId, userId) => {
    try {
        const updated = await Post.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $pull: { likes: userId },
                $inc: { likeCount: -1 }
            },
            { returnDocument: 'after' }
        );

        return updated;
    } catch (err) {
        console.error(err.message);
    }
}

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

module.exports.deleteSave = async (req, res) => {
    const { postId } = req.params;
    const token = req.cookies.token;
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findOne({
            email: user.email
        });
        await User.findByIdAndUpdate(
            currentUser?._id,
            {
                $pull: { savedPost: postId }
            }
        )
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}