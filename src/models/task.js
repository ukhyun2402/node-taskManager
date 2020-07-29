const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
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

taskSchema.pre('save',async function(next) {
    const task = this;
    // await console.log(task);
    next();
});

const taskModel = mongoose.model('Task',taskSchema);

module.exports = taskModel;