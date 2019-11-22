const mongoose = require('mongoose')
const User = require('./models/User.js')

// const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
const URI = "mongodb://localhost:27017/test"
mongoose.connect(URI,{useNewUrlParser:true,useUnifiedTopology: true})
function getUserById(_id){
	let query = {_id: _id};
	return User.find(query);
}

function getUsersById(_ids){
	let query = {_id:{$in:_ids}};
	return User.find(query, { projection: { password:0,username:0,address:0,courses:0, tests:0, question: 0,links:0, files:0 } });
}

function getUserByAccount(username,password){
	let query ={
		username: username,
		password: password
	}
	return User.findOne(query);
}

function InsertUser(user){
	let userObject = new User(user);
	serObject.save((err,res)=>{
		if(err) throw err;
		console.log(res);
		console.log('create success ');
	})
}

function CheckUsername(username){
	let query = {username: username}
	return User.find(query).countDocuments()
}


exports.UserDB={
	getUserById:getUserById,
	getUserByAccount:getUserByAccount,
	InsertUser:InsertUser,
	getUsersById: getUsersById,
	CheckUsername:CheckUsername
}

