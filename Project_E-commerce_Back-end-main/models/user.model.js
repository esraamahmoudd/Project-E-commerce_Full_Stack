const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    FirstName:{
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    },  
    LastName:{
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
    }
    ,
    email :{
        type: String,
        required: true,
        unique: true,
         validate: [isEmail,'Enter a valid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    }
        ,
        token:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['user', "admin"],
        default: 'user'
    }
        });
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;