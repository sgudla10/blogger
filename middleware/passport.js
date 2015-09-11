let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User=require('../models/user')
let crypto = require('crypto')
let SALT = 'CodePathHeartNodeJS'
let util=require('util')
let nodeify = require('bluebird-nodeify')



module.exports=(app) =>{
	let passport=app.passport
    passport.serializeUser(nodeifyit(async (user) => user._id))
    passport.deserializeUser(nodeifyit(async (id)=>{
		return await User.promise.findById(id)
    

    }))

    passport.use(new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'username',
    // We'll need this later
    failureFlash: true
   }, nodeifyit(async (username, password) => {
     let user
     if(username.indexOf('@')){
     	console.log("login with emial id "+username)
     	let email=username.toLowerCase()
		user=await User.promise.findOne({email:username})
		console.log("DATABASE OBJECT "+user)
     }
     else {
 		let regexpat=new RegEx(username,i)
   		user=await User.promise.findOne({username})
     }

   	if(!user|| username !==user.username){
   		return [false,{message:'Invalid user Name'}]
   	}
   	if(!await user.validatePassword(password)){
   		return [false,{message:'Invalid password'}]
   	}
   
   return user

   }, {spread: true})))

   passport.use('local-signup', new LocalStrategy({
   // Use "email" field instead of "username"
  	 usernameField: 'email',
  	 failureFlash:true,
  	 passReqToCallback:true
	}, nodeifyit(async (req,email, password) => {

    	email = (email || '').toLowerCase()
    // Is the email taken?
    console.log("i am here ")
    let {username,title,description}=req.body
    console.log("username "+username+"title "+title+"description "+description)
    if(await User.promise.findOne({email})){
     	return [false,{message:'Email is already taken'}]
     }
     
    if(await User.promise.findOne({username})){
     	return [false,{message:'username is already taken'}]
     }
    // create the user
    let user = new User()
    user.email = email
    user.username=username
    user.blogTitle=title
    user.blogDescription=description
    // Use a password hash instead of plain-text
    user.password =password
    try {
    	return await user.save()
     }
     catch(e){
     	console.log(util.inspect(e))
     	return [false,{message:e.message}]
     }


}, {spread: true})))
   

}