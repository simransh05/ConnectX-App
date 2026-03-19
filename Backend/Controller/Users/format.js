module.exports.formatUser = (user) => {
    // console.log('format', user);
    if (!user) return null;
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        socialLinks: user.socialLinks,
        joinedAt: user.joinedAt,
        googleId: user?.googleId,
        bio: user.bio,
        savedPost: user.savedPost,
        location: user.location,
        profilePic: user.profilePic
            ? `data:${user.fileType};base64,${user.profilePic.toString("base64")}`
            : null
    };
}

module.exports.formatPost = (post) => {
    if (!post) return;
    return {
        userId: {
            _id: post.userId?._id,
            name: post.userId?.name,
            profilePic: post.userId?.profilePic
                ? `data:${post.userId.fileType};base64,${post.userId.profilePic.toString("base64")}`
                : null
        },
        _id: post._id,
        caption: post.caption,
        likes: post.likes,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        fileType: post.fileType,
        photoVideo: post.photoVideo
            ? `data:${post.fileType};base64,${post.photoVideo.toString("base64")}`
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
                ? `data:${comment.userId.fileType};base64,${comment.userId.profilePic.toString("base64")}`
                : null
        },
        postId: comment.postId,
        message: comment.message,
        _id: comment._id
    }
}

module.exports.formatChat = (user) => {
    if (!user) return null;
    return {
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic
            ? `data:${user.fileType};base64,${user.profilePic.toString("base64")}`
            : null
    }
}

module.exports.formatFollow = (data) => {
    const user = data?.following?.name ? data?.following : data?.follower;
    // console.log('user', user)
    return {
        _id: data._id,
        name: user?.name,
        userId: user?._id,
        profilePic: user?.profilePic
            ? `data:${user.fileType};base64,${user.profilePic.toString("base64")}`
            : null
    }
}

module.exports.formatNotify = (user) => {
    if (!user) return null;
    // format - sender name , profile pic , createdat, type, id of user and _id
    return {
        _id: user._id,
        type: user.type,
        profilePic: user?.sender?.profilePic
            ? `data:${user.sender.fileType};base64,${user.sender.profilePic.toString("base64")}`
            : null,
        name: user.sender.name,
        userId: user.sender._id,
        createdAt: user.createdAt
    }
}