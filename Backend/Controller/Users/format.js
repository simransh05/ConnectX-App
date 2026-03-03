module.exports.formatUser = (user) => {
    // console.log('format', user);
    if (!user) return null;
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        socialLinks: user.socialLinks,
        joinedAt: user.joinedAt,
        bio: user.bio,
        location: user.location,
        profilePic: user.profilePic
            ? `data:${user.profilePicType};base64,${user.profilePic.toString("base64")}`
            : null
    };
}

module.exports.formatPost = (post) => {
    if (!post) return;
    return {
        userId: {
            _id: post.userId._id,
            name: post.userId.name,
            profilePic: post.userId.profilePic
                ? `data:${post.userId.profilePicType};base64,${post.userId.profilePic.toString("base64")}`
                : null
        },
        _id: post._id,
        caption: post.caption,
        likes: post.likes,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        photoVideo: post.photoVideo
            ? `data:${post.photoVideoType};base64,${post.photoVideo.toString("base64")}`
            : null
    }
}

module.exports.formatComment = (comment) => {
    if (!comment) return;
    return {
        userId: {
            _id: comment.userId._id,
            name: comment.userId.name,
            profilePic: comment.userId.profilePic
                ? `data:${comment.userId.profilePicType};base64,${comment.userId.profilePic.toString("base64")}`
                : null
        },
        postId: comment.postId,
        message: comment.message,
        _id: comment._id
    }
}