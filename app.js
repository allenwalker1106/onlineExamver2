const express = require('express')
const session = require('express-session')
const uuid = require('uuid/v4')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const DB =  require('./mongoDBQuery.js').DB




const PORT = 3000

const app =express()

app.use(express.json())
app.use(session({
	genid: (req)=>{
		return uuid();
	},
	store : new FileStore(),
	secret: 'secret Key',
	resave:false,
	saveUninitialized: true
}))

passport.use(new LocalStrategy(
	{usernameField: 'username'},
	async (username,password,done)=>{
		let query = DB.getUserByAccount(username,pasword)
	
		const user = await getUserByAccount(username,password)
		console.log(user);
	}
))


app.get('/',(req,res)=>{
	let query = DB.getUserByAccount(username,pasword);
	console.log(query);
})

app.get('/login',(req,res)=>{
	
})

app.post('/login',(req,res)=>{
	
})

app.set('port',PORT)