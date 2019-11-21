const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        min: 6,
        max: 255,
        required: true
    },
    administrator:{
        type:mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }],
    create_date:{
        type: Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Course', classSchema, 'courses');