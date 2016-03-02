/**
 * Created by kprasad on 3/1/16.
 */
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }
});

mongoose.model('Comments', CommentSchema);