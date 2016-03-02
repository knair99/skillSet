var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Employees = mongoose.model('Employees');
var Skills = mongoose.model('Skills');
var Comments = mongoose.model('Comments');


//Preprocessors
router.param('profile', function(req, res, next, id){ //this gets the params in the http request for all post
  var query = Employees.findById(id);

  query.exec(function(err, employee){
    if (err) {return next(err);}
    if(!employee) { return next(new Error('cant find that post!')); }

    req.employee = employee;
    return next(); //lets it call other routes
  });
});
router.param('skill', function(req, res, next, id){ //this gets the params in the http request for all post
  var query = Skills.findById(id);

  query.exec(function(err, skill){
    if (err) {return next(err);}
    if(!skill) { return next(new Error('cant find that post!')); }

    req.skill = skill;
    return next(); //lets it call other routes
  });
});

router.param('comment', function(req, res, next, id){ //gets the params in the http request for all comment by id
  var query = Comments.findById(id);

  query.exec(function(err, comment){
    if (err) {return next(err);}
    if(!comment) { return next(new Error('cant find that comment!')); }

    //now save it as part of the request, so other routing that has 'post' in the
    //parameter can find the approp post (got from the DB)
    req.comment = comment;
    return next(); //this will let it call the other routes
  });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get search results
router.get('/search', function(req, res, next) {
  Employees.find(function(err, employees){
    if(err){ return next(err); }

    res.json(employees);
  });
});


//Get one employee page - display all skills
router.get('/profile/:employee', function(req, res) {
  res.json(req.employee);
});

//Post a new skill
router.post('/profile/:employee', function(req, res, next) {
  var skill = new Skills(req.body);

  skill.save(function(err, post){
    if(err){ return next(err); }

    res.json(skill);
  });
});

//Post a new comment
router.post('/profile/:employee/:skill/', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.skill = req.skill; //We have this thanks to the preprocessing param function
  comment.author = req.payload.username; //Now, we can actually add username to everything

  comment.save(function(err, comment){
    if(err) { return next(err); }

    //Else, go ahead and save the comment to the post too
    req.skill.comments.push(comment);
    req.skill.save(function(err, post){
      if(err) { return next(err); }

      res.json(comment);
    });
  });

});


//Upvote a skill
router.put('/profile/:employee/:skill/upvote', function(req, res, next) {
  req.skill.upvote(function(err, skill){
    if (err) { return next(err); }
    res.json(skill);
  });
});


//Upvote a comment
router.put('/profile/:employee/:skill/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});



module.exports = router;
