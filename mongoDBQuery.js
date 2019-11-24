const mongoose = require('mongoose')
const User = require('./models/User.js')
const Question = require('./models/questions/Question.js')
// const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
// const URI = "mongodb://localhost:27017/test"

function connect(URI){
	mongoose.connect(URI,{useNewUrlParser:true,useUnifiedTopology: true},(err,res)=>{
		if(err) throw err
		console.log('Connect Succesful')
	})
}
//user DB function
function getUserById(_id){
	let query = {_id: _id};
	return User.findOne(query);
}

function getUsersById(_ids){
	let query = {_id:{$id:_ids}};
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
	//authenzied the user and add the user tp databases 
	let userObject = new User(user);
	userObject.save((err,res)=>{
		if(err) throw err;
		console.log(res);
		console.log('create success ');
	})
}

function CheckUsername(username){
	let query = {username: username}
	return User.findOne(query).countDocuments()
}

function checkEmail(email){
	let query={email: email}
	return User.findOne(query).countDocuments();
}
//user DB function


//question DB function
function getQuestionByUserId(_ids){
	let query = {_id:{$in:_ids}};
	return Question.find(query);
}



exports.DB={
	connect: connect
}
//export macro
exports.UserDB={
	getUserById:getUserById,
	getUserByAccount:getUserByAccount,
	InsertUser:InsertUser,
	getUsersById: getUsersById,
	CheckUsername:CheckUsername,
	checkEmail:checkEmail
}

exports.QuestionDB={
	getQuestionByUserId:getQuestionByUserId
}