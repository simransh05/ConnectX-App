const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024 // 15mb
    }
})
const passport = require('../Controller/Users/passport')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const users = require('../Controller/Users/signup')
const follow = require('../Controller/follow');
const notification = require('../Controller/Notification');
const message = require('../Controller/Message');
const post = require('../Controller/Post');
const comment = require('../Controller/comment')

router.post('/signup', users.postSignup);

router.post('/login', users.postLogin);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.BASE_URL}/login` }),
    (req, res) => {

        const token = jwt.sign(
            { id: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        res.redirect(`${process.env.BASE_URL}`);
    }
);

router.get('/user/individual', users.getUser);

router.post('/update/user', upload.single('profilePic'), users.updateProfile);

router.get('/user', users.getAllUsers);

router.post('/user/update', users.postPassword);

router.post('/post/save', users.savePostUser);

router.delete('/saved-posts/:postId', post.deleteSave)

router.get('/post/save/:userId', post.getSavedPost);

router.get('/logout', users.getLogout);

router.get('/post/individual/:userId/:skip', post.getIndividualPosts);

router.get('/post/:skip', post.getAllPosts);

router.delete('/post/:postId', post.deletePost)

router.post('/post', upload.single('photoVideo'), post.postUploadPost);

router.get('/notification/:userId', notification.getNotification);

router.post('/notification/delete/:userId', notification.deleteNotify)

router.get('/chats/individual/:user1/:user2/:type', message.getIndividualMessage);

router.post('/group/post', message.postGroup);

router.put('/group', message.leaveGroup);

router.get('/chats/:userId', message.getMessages);

router.post('/chats/delete/:userId/:other/:type', message.deleteChat)

router.get('/follow/:userId', follow.getFollow);

router.delete('/comment/:commentId/:postId', comment.deleteComment)

router.post('/post/comment', comment.postComment);

router.get('/post/comment/:postId', comment.getComment);

module.exports = router;