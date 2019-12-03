const mongoose = require('mongoose');
const testSchema =  new mongoose.Schema({
	name: {
		type: String,
		required:true,
		min: 6,
		max: 255
	},
	test_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Test"
    },
    availability:{
        type: Boolean,
        default: false
    },
    attemps:{
        type:Number,
        default: -1
    },
    restrictions:{
        type: Boolean,
        default: false
    },
    required_fields:{
        type:Array,
        default: []
    },
    time_limit: {
        type:Number,
        default: -1
    },
    static_time:{
        type:Boolean,
        default:true
    },
    randomize:{
        type:Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.ObjectId
    }
})

module.exports=mongoose.model('Link',testSchema,'links');