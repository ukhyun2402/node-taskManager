const mongoose = require('mongoose');
const validator = require('validator');


const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description: {
        required: true,
        type: String,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:false,
    }
});

module.exports = mongoose.model('Task',taskSchema);