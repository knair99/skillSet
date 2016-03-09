/**
 * Created by kprasad on 3/1/16.
 */
var mongoose = require('mongoose');

var SkillSchema = new mongoose.Schema({
    skill: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
    employee: [{type: mongoose.Schema.Types.ObjectId, ref:'Employees'}]
});

SkillSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Skills', SkillSchema);

/*
{ "skill": "C", "link": "www.link.com", "upvotes":0, "comments": {[{}]} skill}
 */

