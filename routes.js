let isLoggedIn = require('./middleware/isLoggedIn')
let fs=require('fs')
let then = require('express-then')
let multiparty = require('multiparty')
let Post = require('./models/post')
let Comment = require('./models/comment')

let DataUri=require('datauri')


module.exports=(app)=>{
	let passport=app.passport
	app.get('/',(req,res)=>{
		res.render('index.ejs')
	})

	app.get('/login', (req, res) => res.render('login.ejs', {message: req.flash('error')}))

	app.get('/signup', (req, res) => res.render('signup.ejs', {message: req.flash('error')}))


	app.post('/login',passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
    }))
	app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
   }))

	app.get('/profile',isLoggedIn,then(async (req,res)=>{
		let posts = await Post.promise.find({userId: req.user.id})
		res.render('profile.ejs',
		{
            user:req.user,
            posts: posts,
			message:req.flash('error')})
	}))

	app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
    })

   app.get('/post/:postId?', then(async(req, res) => 
		{
 			let postId=req.params.postId
 			if(!postId){
 				res.render('post.ejs',{
 					post:{},
 					verb:'Create'
 				})
 			  return
 			}
 			let post=await Post.promise.findById(postId)
 			if(!post){
 				res.send('404',"Not Found")
 			}
 			res.render('post.ejs',{
 					post:post,
 					verb:'Edit',
 					image:post.image
 				})


		}))


   app.get('/blog/:userId?', then(async(req, res) => 
		{
 			let userId=req.params.userId
 			let posts=await Post.promise.find({userId})
 			
 			res.render('blog.ejs',{
            		posts: posts
 				})


		}))


app.get('/blog/post/:postId?', then(async(req, res) => 
		{
 			let postId=req.params.postId
 			let post=await Post.promise.findById(postId)
 			let comments=await Comment.promise.find({postId})
 			console.log("post is "+post)
 			
 			let datauri = new DataUri
 			let image = datauri.format('.'+ 
        	post.image.contentType.split('/').pop(),post.image.data)

      		console.log("Found a match PostId: " + postId + ", post: " + post) 
 			res.render('postDetail.ejs',{
            		post: post,
            		image: `data:${post.image.contentType};base64,${image.base64}`,
            		comments:comments

 				})


		}))

   app.post('/blog/post/addComment/:postId?', then(async(req, res) => 
		{
 			//return req.pipe(process.stdout)
 			let postId=req.params.postId
 			let comment=new Comment()
 			comment.postId=postId
 			comment.comment=req.body.content
 			console.log("comments "+comment)
 			await comment.save()
 			res.redirect('/blog/post/'+postId)
           

		}))



   app.post('/post/:postId?', then(async(req, res) => 
		{
 			//return req.pipe(process.stdout)
 			let postId=req.params.postId
 			if(!postId){
 				let post=new Post()
 				post.title=req.body.title
 				post.content=req.body.content
 				console.log("body "+req.body)
	            let[{title: [title], content: [content]}, {image: [file]}] = await new multiparty.Form().promise.parse(req)
 				post.image.data=await fs.promise.readFile(file.path)
 				post.title=title
 				post.content=content
 				post.image.contentType=file.headers['content-type']
 				console.log("user "+req.user)
 				post.userId=req.user.id
 				console.log("Before soring "+post.userId)
 				await post.save()

 				console.log("redirecting to "+encodeURI(req.user.blogTitle))
 				res.redirect('/blog/post/'+encodeURI(post.id))

 				}
           

		}))

}