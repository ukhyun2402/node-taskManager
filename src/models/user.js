const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        unique: true,
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

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'ukhyun');
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched) {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model( 'User', userSchema);

module.exports = User;