const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const UserDB =  require('./mongoDBQuery.js').UserDB;
const QuestionDB = require('./mongoDBQuery.js').QuestionDB;
const TestDB  = require('./mongoDBQuery.js').TestDB;
const DB = require('./mongoDBQuery.js').DB;
const PORT = 3000
const URI = 'mongodb://localhost:27017/test'
// const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
// const URI = 'mongodb://localhost:27017/test'

DB.connect(URI);
const app =express()

app.set('views',__dirname+'/public/views');
app.use(express.static('public/'))
app.set('view engine','ejs');

// add & configure middleware

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.get('/',(req,res)=>{
	if(req.session.isAuthenticated){
		res.redirect('home');
	}
	else
		res.redirect('/signup')
})

app.post('/login', async (req,res)=>{
	if(!req.session.isAuthenticated)
	{
		
		let user = req.body.user;
		const username_exist = await UserDB.CheckUsername(user.username).exec() ===1 ? true: false;
		if(!username_exist){
			// the account or user name is not exist 
			res.render('login',{user:{username: user.username}});
			req.session.isAuthenticated =  false;
		}
		const user_data =await UserDB.getUserByAccount(user.username,user.password).exec();
		if(!user_data){
			//return err
			// the password is wrong 
			res.render('login',{user:{username: user_data.username}});
		}
		console.log('saved');
		req.session.user = user_data;
		req.session.isAuthenticated = true;
		res.redirect('/home')
	}else{
		console.log('user autheni')
		res.redirect('/home')
	}
})

app.get('/login',(req,res)=>{
	if(req.session.user)
		console.log(req.session.user)
	if(req.session.isAuthenticated)
		console.log(req.session.isAuthenticated)
	if(req.session.user&& req.session.isAuthenticated){
		res.redirect('/home')
	}
	else{
		if(req.session.user){
			res.render('login',{user:{username:req.session.user.username}});
		}else
			res.render('login',{user:{username:''}});
	}
})

app.get('/signup',(req,res)=>{
	if(req.session.isAuthenticated){
		res.redirect('/home')
	}
	else{
		res.render('signup');	
	}
})

app.post('/signup',async (req,res)=>{
	//post check required
	let user = req.body.user
	console.log(user);
	const username_exist = await UserDB.CheckUsername(user.username).exec() ===1;
	if(username_exist){
		console.log('user')
		// render err msg 
		res.redirect('/signup')
		res.end()
	}
	const email_exist = await UserDB.checkEmail(user.email).exec() !=0;
	console.log(email_exist)
	if(email_exist){
		console.log('email')
		//consolr log err mess email exist 
		res.redirect('signup')
		res.end()
		return;
	}
	UserDB.InsertUser(user);
	res.redirect('/login')
	res.end()
})


app.get('/home',async (req,res)=>{
	if(req.session.isAuthenticated){
		// res.send('LOGGEDIN');
		let user =req.session.user;
		const user_data =await UserDB.getUserByAccount(user.username,user.password).exec();
		req.session.user = user_data;
		res.render('home',{user:req.session.user})
		res.end();
	}
	else
		res.redirect('/login')
})

app.get('/update',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user)
	{
		console.log(req.session.user)
		req.session.user = await UserDB.getUserById(req.session.user._id).exec()
		console.log(req.session.user)
		// res.redirect('/home')
		res.end();
	}
	else{
		res.redirect('/login')
	}
})

app.get('/questions',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user ){
		const questions  = await QuestionDB.getQuestionByUserId(req.session.user.questions).exec();
		res.render('questions',{user:req.session.user,questions:questions});
		console.log(questions);
		res.end()
	}
	else{
		res.redirect('/login')
	}
})


app.get('/create_question',(req,res)=>{
	if(req.session.isAuthenticated){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('create_question',{user:user});
	}else{
		res.redirect('login')
	}
})

app.post('/create_question',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		console.log(req.body)	
		let question = req.body.question
		let _id = req.session.user._id;
		console.log(question)
		if(question.type==='Mutiple Choices'){
			console.log('a')
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			// console.log(res);
			res.redirect('/create_question');
		}
	}else
		res.redirect('/login')

})

app.get('/logout',(req,res)=>{
	req.session.destroy();
	res.redirect('/signup');
})

/// Test
app.get('/tests',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		const tests  = await TestDB.getTestByUserId(req.session.user.tests).exec();
		res.render('tests',{user:req.session.user,tests:tests});
		res.end()
	}else
		res.redirect('/login');
})


app.get('/create_test',(req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('create_test',{user:user});
	}else{
		res.redirect('/login');
	}
})

app.post('/create_test',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		let test=TestDB.createTest(req.body.test,req.session.user._id);
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		const questions  = await QuestionDB.getQuestionByUserId(req.session.user.questions).exec();
		res.render('add_question',{user:user,test:test,questions: questions});
		res.end();
	}else{
		res.redirect('/login');
	}
})

app.post('/add_question',(req,res)=>{

	if(req.session.isAuthenticated&& req.session.user){
		test = req.body.test;
		console.log(test)
		TestDB.addQuestion(test._ids,test._id);
		res.redirect('/tests');
		res.end();
	}else{
		res.redirect('/login');
	}
})

app.listen(PORT,(err)=>{
	console.log(`app.listen on port ${PORT}`)
})