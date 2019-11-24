const mongoose = required('mongoose');

const questionSchema = new mongoose.Schema({
	type:{
		type:String,
		required: true,
		default:"true_false"
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
	imported:[{
		type:mongoose.Schema.ObjectId,
	}],
	result:{
		type: Boolean,
		required: true,

	}
})


module.exports = mongoose.model('QValidate',questionSchema,'questions');