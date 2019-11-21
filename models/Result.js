const mongoose = require('mongoose');
const resultSchema= new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	owner:{
		type: mongoose.Schema.ObjectId,
		ref: 'Users'
	},
	result:[{
		question_id:{
			type:mongoose.Schema.ObjectId,
			required: true
		},
		answear:{
			type:Object,
			required:true
		}
	}]
})


module.exports=('Result',resultSchema,"results");