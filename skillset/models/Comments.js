/**
 * Created by kprasad on 3/1/16.
 */
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    skill: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }]
});

CommentSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Comments', CommentSchema);

/*
{ 'body':'this is a comment', 'author':'joe', 'upvotes':1, 'skill':{} }
 */