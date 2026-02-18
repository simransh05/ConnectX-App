const User = require("../../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
module.exports.postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const already = await User.findOne({ email });
        if (already) {
            return res.status(400).json({ message: 'Already have account' })
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashed
        })
        await user.save();
        return res.status(200).json({ message: 'Succesfully added' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'credential required' })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Not signup' })
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        return res.status(200).json({ message: 'Succesful' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}