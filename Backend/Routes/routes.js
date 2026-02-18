const express = require('express');
const router = express.Router();
const controller1 = require('../Controller/Users/signup')
const passport = require('../Controller/Users/passport')
require('dotenv').config()
const jwt = require('jsonwebtoken')
router.post('/signup', controller1.postSignup);

router.post('/login', controller1.postLogin);
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

module.exports = router;