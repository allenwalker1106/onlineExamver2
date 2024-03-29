const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
	type:{
		type:String,
		required: true,
		default:"matching"
	},
	topic:{
		type:String,
		required:true,
		default:'general'
	},
	owner:{
		type:mongoose.Schema.ObjectId,
		ref:'Users'
	},
	body:{
		type:String,
		required: true,
	},
	imported:{
		type:Array,
		default:[],
		required: true
	},
	options:{
		type:Array,
		default:[],
		required: true
	},
	result:{
		type:Array,
		default:[],
		required: true
	},
	create_date :{
		type: Date,
		required: true,
		default : Date.now
	},
	modified_date:{
		type: Date,
		required: true,
		default: Date.now
	}
})


module.exports = mongoose.model('QMatching',questionSchema,'questions');