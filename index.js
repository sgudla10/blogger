let express = require('express')
let morgan = require('morgan')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let passport = require('passport')
let flash = require('connect-flash')
let mongoose = require('mongoose')
let passportMiddleware=require('./middleware/passport')
let routes=require('./routes')

require('songbird')

const PORT=process.env.PORT||8080

let app=express()

app.passport=passport
app.use(morgan('dev'))
app.use(cookieParser('ilovenodejs'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(session({
	secret:'ilovenodejs',
	resave:'true',
	saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
passportMiddleware(app)
routes(app)


mongoose.connect('mongodb://127.0.0.1:27017/blogger-demo')
app.listen(PORT, ()=>console.log(`Listening @ http://127.0.0.1:${PORT}`) )
