const mongoose = required('mongoose');

const questionSchema = new mongoose.Schema({
	type:{
		type:String,
		required: true,
		default:"choices"
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
	max_choices:{
		type:Number, 
		min:1,
		default:1,
		required: true
	},
	body:{
		type:String,
		required: true,
	},
	imported:[{
		type:mongoose.Schema.ObjectId,
	}],
	options:{
		type:Array,
		default:[],
		required: true
	},
	result:{
		type:Array,
		default:[],
		required: true
	}
})


module.exports = mongoose.model('QChoices',questionSchema,'questions');