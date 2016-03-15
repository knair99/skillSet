var express = require('express');
var router = express.Router();
var router = express.Router();
var mongoose = require('mongoose');

//Get the employees model
var Employees = mongoose.model('Employees');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Add a new user' });
});

//Post an employee
router.post('/add', function(req, res, next){
  console.log("in add backend");
  var emp = new Employees(req.body);

  //Save into mongoDB
  emp.save(function(err, emp){
    if (err) {return next(err);}

    res.json(emp);
  });

});


module.exports = router;
