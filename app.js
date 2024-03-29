const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const UserDB =  require('./mongoDBQuery.js').UserDB;
const QuestionDB = require('./mongoDBQuery.js').QuestionDB;
const TestDB  = require('./mongoDBQuery.js').TestDB;
const LinkDB  = require('./mongoDBQuery.js').LinkDB;
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

		let user =req.session.user;
		const user_data =await UserDB.getUserByAccount(user.username,user.password).exec();
		req.session.user = user_data;
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
app.get('/qmatching',(req,res)=>{
	if(req.session.isAuthenticated){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('matching',{user:user});
	}else{
		res.redirect('login')
	}
})

app.get('/qtruefalse',(req,res)=>{
	if(req.session.isAuthenticated){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('truefalse',{user:user});
	}else{
		res.redirect('login')
	}
})

app.get('/qtext',(req,res)=>{
	if(req.session.isAuthenticated){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('text',{user:user});
	}else{
		res.redirect('login')
	}
})


app.get('/qcode',(req,res)=>{
	if(req.session.isAuthenticated){
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('code',{user:user});
	}else{
		res.redirect('login')
	}
})


app.post('/create_question',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		let question = req.body.question
		let _id = req.session.user._id;
		console.log(question)
		if(question.type==='Mutiple Choices'){
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			// console.log(res);
			res.redirect('/create_question');
		}else if(question.type==="Matching"){
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			res.redirect('/qmatching');
		}else if(question.type==="True False"){
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			res.redirect('/qtruefalse');
		}else if(question.type==="Text"){
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			res.redirect('/qtext');
		}else if(question.type==="Code"){
			let _qid= QuestionDB.InsertQuestion(question,_id);	
			//update uoser databases ;

			req.session.user.questions.push(_qid);
			UserDB.updateUserById(_id,_qid);
			res.redirect('/qcode');
		}
	}else
		res.redirect('/login')
// 
})

app.get('/logout',(req,res)=>{
	req.session.destroy();
	res.redirect('/signup');
})

/// Test
app.get('/tests',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){

		let user =req.session.user;
		const user_data =await UserDB.getUserByAccount(user.username,user.password).exec();
		req.session.user = user_data;
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



app.post('/add_question',async (req,res)=>{

	if(req.session.isAuthenticated&& req.session.user){
		test = req.body.test;
		const test_ob = await TestDB.getTestById(test._id).exec();
		TestDB.addQuestion(test._ids,test._id);
		QuestionDB.importUpdate(test_ob,test._ids);
		res.redirect('/tests');
		res.end();
	}else{
		res.redirect('/login');
	}
})

app.get('/test_details',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user){
		let test_id = req.query._id
		const test = await TestDB.getQuestion(test_id).exec();
		let user =req.session.user;
		const questions  = await QuestionDB.getQuestionByIds(test.questions).exec();
		
		res.render('test_details',{user:req.session.user,questions:questions,test:test});
		console.log(questions);
		res.end()
	}else{
		res.redirect('/login');
	}
})



app.get('/links',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user ){
		let user =req.session.user;
		const user_data =await UserDB.getUserById(user._id).exec();
		req.session.user = user_data;
		const links = await LinkDB.getLinkByUser(user._id).exec();
		
		res.render('links',{user:req.session.user,links:links});
		console.log(links);
		res.end()
	}
	else{
		res.redirect('/login')
	}
}) 


app.get('/link_config',async (req,res)=>{
	if(req.session.isAuthenticated&& req.session.user ){
		let _id = req.query._id;
		
		let user={
			name: req.session.user.name,
			profile_image_link: req.session.user.profile_image_link
		}
		res.render('link_config',{user:user,test:{_id:_id}},);
		res.end()
	}
	else{
		res.redirect('/login')
	}
})

app.post('/create_link',(req,res)=>{
	if(req.session.isAuthenticated&& req.session.user ){
		let _id = req.query._id;
		
		let config = req.body.link
		config.owner = req.session.user._id
		LinkDB.insertLink(config,_id)
		res.redirect('/links')
		res.end()
	}
	else{
		res.redirect('/login')
	}
})


app.get('/exam_link', async(req,res)=>{
	
	let _id = req.query.quiz;
	const link = await LinkDB.getLinkById(_id).exec();
	const test = await TestDB.getTestById(link.test_id).exec();
	const questions  = await QuestionDB.getQuestionByIds(test.questions).exec()
	console.log(questions)
	if(link.restrictions){
		if(req.session.isAuthenticated&& req.session.user ){
			console.log(link);
			console.log(test);
			res.render('exam_display');
			res.end()
		}
		else{
			res.redirect('/login')
		}
	}else{
		console.log(link);
		console.log(test);
		res.render('exam_display',{link:link,questions:questions});
		res.end()
	}
	
})

app.post('/submit_test',(req,res)=>{
	console.log(req.body);
	res.redirect('/result_display');
	res.end();
})
app.get('/result_display',(req,res)=>{
	res.send('Your result : 5/6')
	res.end()
})




app.listen(PORT,(err)=>{
	console.log(`app.listen on port ${PORT}`)
})


