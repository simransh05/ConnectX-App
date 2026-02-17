const User = require("../../models/user");
const bcrypt = require('bcrypt')
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

