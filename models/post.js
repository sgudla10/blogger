// user.js
let mongoose = require('mongoose')
let nodeify = require('bluebird-nodeify')

require('songbird')


let PostSchema = mongoose.Schema({
    
    title: {
    	type:String,
    	required:true
    },
    content: {
    	type:String,
    	required:true
    },
    image: {
        data:Buffer,
        contentType:String
    },
    userId: {
        type:String,
        required:true
    }

})


module.exports = mongoose.model('Post', PostSchema)
