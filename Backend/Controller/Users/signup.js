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
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.getUser = async (req, res) => {
    const token = req.cookies.token;
    try {
        // console.log(token)
        if (!token) {
            return res.status(404).json({ message: 'no cookie avaiable' })
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: data.email });
        return res.status(200).json(user);
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(200).json([])
        }
        return res.status(200).json(users);
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}

module.exports.updateProfile = async (req, res) => {
    const { data } = req.body;
    try {
        // update the entire data where change 
        const users = await User.find();
        if (!users) {
            return res.status(200).json([])
        }
        return res.status(200).json(users);
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}

module.exports.getLogout = async () => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        return res.status(200).json({ message: 'successfully logout' })
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}