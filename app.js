const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const UserDB =  require('./mongoDBQuery.js').UserDB
const PORT = 3000

const app =express()

app.set('views',__dirname+"/public/views");
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
	if(req.isAuthenticated){
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
	if(req.isAuthenticated){
		res.redirect('/home')
	}
	else{
		res.render('signup');	
	}
})

app.post('/signup',(req,res)=>{
	console.log(req.body)
	res.redirect('/')
})


app.get('/home',(req,res)=>{
	if(req.session.isAuthenticated){
		res.send('LOGGEDIN');
		res.end();
	}
	else
		res.redirect('login')
})


app.set('port',PORT)

app.listen(PORT,()=>{
	console.log(`app.listen on port ${PORT}`)
})