const mongoose = require('mongoose')
const User = require('./models/User.js')
const Question = require('./models/questions/Question.js')
const QChoices = require('./models/questions/QChoices.js')
const Test     = require('./models/Test.js')
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
function InsertQuestion(q,_id){
	let question = {
		type: q.type,
		topic: q.topic,
		owner: _id,
		body: q.body,
		options: q.options,
		result: q.result
	}
	var question_ob = new QChoices(question)
	question_ob.save((err,res)=>{
		if(err)
			console.log('add unsuccessful')	
		console.log('add successfull')
	})
	return question_ob._id

}

function  updateUserById(_id,_qid){
	User.updateOne({_id: _id},{$push:{questions:_qid}},(err,res)=>{
		console.log("Update successful");
	});
}



//// Test databasses

function getTestByUserId(_ids){
	let query = {_id:{$in:_ids}};
	return Test.find(query);
}

function createTest(test,owner){
	let t= {
		name: test.name,
		description:test.description,
		topic:test.topic,
		owner:owner
	}
	var test = new Test(t);
	test.save((err,res)=>{
		if(err) throw err;
		User.updateOne({_id: owner},{$push:{tests:test._id}},(err,res)=>{
			console.log("add test susscess");
		});
	})

	return test;

}


function addQuestion(ids,id){
	Test.updateOne({_id:id},{$push:{questions:ids}});
}
//////Export model and function 

exports.DB={
	connect: connect
}

exports.UserDB={
	getUserById:getUserById,
	getUserByAccount:getUserByAccount,
	InsertUser:InsertUser,
	getUsersById: getUsersById,
	CheckUsername:CheckUsername,
	checkEmail:checkEmail,
	updateUserById:updateUserById
}

exports.QuestionDB={
	getQuestionByUserId:getQuestionByUserId,
	InsertQuestion:InsertQuestion
}


exports.TestDB= {
	getTestByUserId: getTestByUserId,
	createTest:createTest,
	addQuestion:addQuestion
}