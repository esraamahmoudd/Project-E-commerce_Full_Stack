const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({},{'__v':false});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const register= async (req, res) => {
    const { FirstName, LastName, email, password,role } = req.body;
    
    console.log(req.body);
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        FirstName,
        LastName,
        email,
        password: hashedPassword,
        role: role || 'user' 
    });
    const token = jwt.sign({ id: newUser._id , role: newUser.role }, 'JWT_SECRET_KEY', { expiresIn: '1h' });
    newUser.token = token;
        await newUser.save()

    res.status(201).json(newUser)
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
    const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            'JWT_SECRET_KEY', 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAllUsers,
    register,
    login
};