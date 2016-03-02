/**
 * Created by kprasad on 3/1/16.
 */
var mongoose = require('mongoose');

var SkillSchema = new mongoose.Schema({
    skill: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }
});

mongoose.model('Skills', SkillSchema);


