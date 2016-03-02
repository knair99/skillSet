var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Employees = mongoose.model('Employees');
var Skills = mongoose.model('Skills');
var Comment = mongoose.model('Comments');

//Preprocessing routes - for employee
router.param('employee', function(req, res, next, id) {
  var query = Employees.findById(id);

  query.exec(function (err, employee){
    if (err) { return next(err); }
    if (!employee) { return next(new Error('can\'t find employee\'s profile')); }

    req.employee = employee;
    return next();
  });
});

//Preprocessing routes - for skill
router.param('skill', function(req, res, next, id) {
  var query = Skills.findById(id);

  query.exec(function (err, skill){
    if (err) { return next(err); }
    if (!skill) { return next(new Error('can\'t find skill page')); }

    req.skill = skill;
    return next();
  });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Get search results
router.get('/employees', function(req, res, next) {
  Employees.find(function(err, employees){
    if(err){ return next(err); }

    res.json(employees);
  });
});


//Get one employee page
router.get('/employees/:employee', function(req, res) {
  res.json(req.employee);
});


module.exports = router;
