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

function formatUser(user) {
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

module.exports.getUser = async (req, res) => {
    const token = req.cookies.token;
    try {
        // console.log(token)
        if (!token) {
            return res.status(404).json({ message: 'no cookie avaiable' })
        }
        const data = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('line 60', data)
        const user = await User.findOne({ email: data.email });
        return res.status(200).json(formatUser(user));
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}

module.exports.getAllUsers = async (req, res) => {
    const { userId } = req.params;
    try {
        const users = await User.find({
            _id: { $ne: userId }
        });
        if (!users) {
            return res.status(200).json([])
        }
        return res.status(200).json(users.map(formatUser));
    }
    catch (err) {
        return res.status(500).json({ message: 'internal error' })
    }
}

module.exports.postPassword = async (req, res) => {
    const { userId, oldPass, newPass } = req.body;
    try {
        if (!oldPass || !newPass) {
            return res.status(404).json({ message: "Fields required" })
        }
        console.log('old new', oldPass, newPass)
        const user = await User.findById(userId);
        console.log('user', user);
        const valid = await bcrypt.compare(oldPass, user.password);
        console.log('valid', valid)
        if (!valid) {
            return res.status(404).json({ message: 'Old password not valid' })
        }
        const hashed = await bcrypt.hash(newPass, 10);
        console.log('hashed', hashed)
        user.password = hashed;
        await user.save();
        return res.status(200).json({ message: 'Successfully updated' })
    } catch (err) {
        return res.status(500).json({ message: 'Server Error' })
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const { name, email, bio, location, userId } = req.body;
        // console.log('line 88', name, email, bio, location)
        const updateData = {
            name,
            email,
            bio,
            location,
        };

        if (req.file) {
            updateData.profilePic = req.file.buffer;
        }
        // console.log('updated', updateData)

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );
        // console.log('here', user)
        return res.status(200).json(formatUser(user));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getLogout = async (req, res) => {
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