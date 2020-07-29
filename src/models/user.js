const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model( 'User' ,{
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    password:{
        type:String,
        required: true,
        trim: true,
        minlength:7,
        validate(value) {
            if(validator.contains(value,'password',{ignoreCase: true})) {
                throw new Error("password doesn't contains text password");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 ) {
                throw new Error('Age must be positive numbeer');
            }
        }
    },
});

module.exports = User;