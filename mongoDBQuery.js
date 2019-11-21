const mongoose = require('mongoose')
const User = require('./models/User.js')

const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
mongoose.connect(URI)

function getUserById(_id){
	let query = {_id: _id};
	return User.find(query);
}

function getUserByAccount(username,password){
	let query ={
		username: username,
		password: password
	}
	return User.find(query);
}

function InsertUser(user){
	let userObject = new User(user);
	serObject.save((err,res)=>{
		if(err) throw err;
		console.log(res);
		console.log('create success ');
	})
}


exports.DB={
	getUserById:getUserById,
	getUserByAccount:getUserByAccount,
	InsertUser:InsertUser
}