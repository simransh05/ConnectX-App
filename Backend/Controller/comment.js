const Comment = require('../models/comment');
const Post = require('../models/post');
const { formatComment } = require('./Users/format');

module.exports.getComment = async (req, res) => {
    const { postId } = req.params;
    try {
        const comment = await Comment.find({ postId }).populate('userId', 'name profilePic _id').sort({ createdAt: -1 });
        // console.log('get', comment)
        if (!comment) {
            return res.status(200).json([]);
        }
        return res.status(200).json(comment.map(formatComment));
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postComment = async (req, res) => {
    console.log(res.body);
    const { postId, comment, userId } = req.body;
    try {

        console.log('post', postId, comment, userId)
        if (!postId || !comment || !userId) {
            return res.status(404).json({ message: 'Failed' })
        }
        await Post.findByIdAndUpdate(
            postId,
            { $inc: { commentCount: 1 } }
        )
        await Comment.create({
            postId,
            message: comment,
            userId
        })
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}