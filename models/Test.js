const mongoose = require('mongoose');
const testSchema =  new mongoose.Schema({
	name: {
		type: String,
		required:true,
		min: 6,
		max: 255
	},
	description: {
		type:String,
		min: 6,
		max : 1024
	},
	questions:[{
		type: mongoose.Schema.ObjectId,
		ref:'Questions'
	}],
	topic:{
		type: String,
		required: true
	},
	create_date:{
		type:Date,
		default: Date.now
	},
	last_modified:{
		type:Date,
		default: Date.now
	},
	owner:{
		type: mongoose.Schema.ObjectId,
		ref: 'Users'
	}
})

module.exports=mongoose.model('Test',testSchema,'tests');