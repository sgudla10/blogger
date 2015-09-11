let mongoose = require('mongoose')
let nodeify = require('bluebird-nodeify')

require('songbird')


let CommentSchema = mongoose.Schema({
    
    
    comment: {
    	type:String,
    	required:true
    },
    postId: {
        type:String,
        required:true
    }

})


module.exports = mongoose.model('Comment', CommentSchema)