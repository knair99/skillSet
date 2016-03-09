var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Employees = mongoose.model('Employees');
var Skills = mongoose.model('Skills');
var Comments = mongoose.model('Comments');


//Preprocessors - employee
router.param('employee', function(req, res, next, id){ //this gets the params in the http request for all post
  var query = Employees.findById(id);
  query.exec(function(err, employee){
    if (err) {return next(err);}
    if(!employee) { return next(new Error('cant find that employee!')); }

    req.employee = employee;
    return next(); //lets it call other routes
  });
});

//Preprocessors - skill
router.param('skill', function(req, res, next, id){ //this gets the params in the http request for all post
  var query = Skills.findById(id);
  query.exec(function(err, skill){
    if (err) {return next(err);}
    if(!skill) { return next(new Error('cant find that skill!')); }

    req.skill = skill;
    return next(); //lets it call other routes
  });
});

//Preprocessors - comment
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

//User actions, HTTP verbs, REST routing, etc
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Skills' });
});

//Get search results
router.get('/getData', function(req, res, next) {
  Employees.find(function(err, employees){
    if(err){ return next(err); }

    res.json(employees);
  });
});

//Get one employee page - display all skills
router.get('/profile/:employee', function(req, res){

  req.employee.populate('skills', function(err, employee) {
    if (err) {
      return next(err);
    }
    res.json(req.employee);
  })
});

//Get one skill's comment page - display all comments
router.get('/profile/:employee/skill/:skill', function(req, res){
  req.skill.populate('comments', function(err, skill) {
    if (err) {
      return next(err);
    }
    res.json(req.skill);
  })
});

//Post a new skill
router.post('/profile/:employee', function(req, res, next) {
  var skill = new Skills(req.body);
  skill.employee = req.employee;

  //Save the new skill
  skill.save(function(err, skill) {
    if (err) {
      return next(err);
    }

    //Update employee with new skill
    req.employee.skills.push(skill);
    req.employee.save(function (err, employee) {
      if (err) { return next(err); }
      res.json(skill);
    });
  });

});

//Post a new comment
router.post('/profile/:employee/skill/:skill/', function(req, res, next) {
  var comment = new Comments(req.body);

  //Cross ref to skill
  comment.skill = req.skill;

  //Save the comment
  comment.save(function(err, comment){
    if(err) { return next(err); }

    //Update skill with new comment
    req.skill.comments.push(comment);
    req.skill.save(function(err, skill){
      if(err) { return next(err); }
      //Else respond back with json
      res.json(comment);
    });
  });

});


//Upvote a skill
router.put('/profile/:employee/skill/:skill/upvote', function(req, res, next) {
  req.skill.upvote(function(err, skill){
    if (err) { return next(err); }
    res.json(skill);
  });
});


//Upvote a comment
router.put('/profile/:employee/skill/:skill/comment/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }
    res.json(comment);
  });
});


module.exports = router;
