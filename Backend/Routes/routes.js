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
const post = require('../Controller/Post')

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

router.post('/update/user', users.updateProfile);

router.get('/user', users.getAllUsers);

router.get('/logout', users.getLogout);

router.get('/post/individual/:userId', post.getMyPosts);

router.get('/post', post.getAllPosts);

router.get('/notification/:userId', notification.getNotification);

router.get('/chats/individual/:user1/:user2', message.getIndividualMessage);

router.get('/chats/:userId', message.getMessages);

router.get('/follow/:userId', follow.getFollow);

module.exports = router;