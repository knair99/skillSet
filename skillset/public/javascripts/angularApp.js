/**
 * Created by kprasad on 3/1/16.
 */


//include any external angular modules in the array
var app = angular.module('skill-search', ['ui.router']);

//I need to route different URLs, and configure my app with services needed
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        //For the /home requests, route it to a custom template, and use MainCtrl controller
        $stateProvider.state('search',
        {
            url:'/search',
            templateUrl:'/search.html',
            controller:'SearchCtrl'
        });

        //Angular route to the profile page
        $stateProvider.state('profile',
        {
            url: '/profile/{id}',
            templateUrl: '/profile.html',
            controller: 'ProfileCtrl',
            resolve: {
                employee: ['$stateParams', 'employees', function ($stateParams, employees) {
                    return employees.get($stateParams.id);
                }]
            }
        });

        //Route to the comments page
        $stateProvider.state('comments', {url:'/profile/:employeeId/skill/:skillId',
                templateUrl:'/comments.html',
                controller:'CommentCtrl',
            resolve: {
                employee: ['$stateParams', 'employees', function ($stateParams, employees) {
                    return employees.get($stateParams.employeeId);
                }],
                skill: ['$stateParams', 'employees', function ($stateParams, employees) {
                    return employees.getSkill($stateParams.employeeId, $stateParams.skillId);
                }]
            }
        });

        //For everything else, route to home, for now
        $urlRouterProvider.otherwise('search');
    }
]);

app.factory('employees', ['$http', function($http){
    var o = { employees: [] };

    //Search - null search = all employees - filter later
    o.getAll = function(){
        return $http.get('/getData').success(function(data){ //This data is from the DB
            angular.copy(data, o.employees);
        });
    };

    //Get one employee's skills
    o.get = function(id){
        return $http.get('/profile/' + id).then(function(res){ //using a promise here with 'then'
            return res.data;
        });
    }

    //Get one skill's comments
    o.getSkill = function(emp_id, skill_id){
        return $http.get('/profile/' + emp_id + '/skill/' + skill_id).then(function(res){
            return res.data;
        });
    }

    //Post one skill
    o.postSkill = function(skill, emp_id, id){
        return $http.post('/profile/' + emp_id, skill).success(function(data){
            o.employees[id].skills.push(data); //TODO: Test this
            //This is for just our front end so it doesn't always go back to the server
        });
    }

    //Post one comment
    o.postComment = function(comment, emp_id, skill_id){ //both these are mongo IDs
        return $http.post('/profile/'+ emp_id + '/skill/' + skill_id, comment).success(function(data){
            //push comment response to front end
            console.log("successfully returned comment ->");
            console.log(data);
        });
    }

    //Upvote a skill
    o.upvoteSkill = function(emp_id, skill_id, skill){
        $http.put('/profile/' + emp_id +'/skill/' + skill_id + '/upvote', null).success(function(data){
            //and for the front end
            skill.upvotes += 1;
        });
    }


    //Finally return the object
    return o;
}]);

//Now define our controllers
app.controller('SearchCtrl', [
    '$scope',
    'employees',
    function($scope, employees){

        $scope.searchForSkills = function(){
            employees.getAll();
            if($scope.skill === '') {return;}

            $scope.employees = employees.employees;
        }

}]);

app.controller('ProfileCtrl', [
    '$scope',
    '$stateParams',
    'employees', //here we give the controller the factory
    'employee',
    function($scope, $stateParams, employees, employee){
        $scope.employee = employee;

        $scope.addSkill = function(){
            if($scope.skill === '') {return;}

            employees.postSkill({skill: $scope.skill, link: $scope.link}, $stateParams.id, employee.id)
                .success(function(skill) {
                $scope.employee.skills.push(skill);
            });
            //Blank out scope data for the next time
            $scope.skill = "";
            $scope.link = "";
        }

        $scope.incrementSkill = function(skill){
            employees.upvoteSkill(employee._id, skill._id, skill);
        }
}]);

//define a controller for our posts
app.controller('CommentCtrl', [
    '$scope',
    '$stateParams',
    'employees',
    'employee',
    'skill',
    function($scope, $stateParams, employees, employee, skill){
        //First, get the relevant skill - promise?
        $scope.employee = employee;
        $scope.skillDetail = skill;
        $scope.skills = employee.skills;

        $scope.addComment = function(){
            if($scope.body === '') { return;}
            //Now post the comment
            employees.postComment({ body: $scope.body, author: 'user', upvotes: 0}, employee._id, $stateParams.skillId);

            //Then add a comments element into a comments array, on the skill object
            //A comment looks like this comments = [ {body:sometext, author:text, upvotes:0}]
            $scope.skillDetail.comments.push( { body: $scope.body, author: 'user', upvotes: 0} );
            $scope.body = "";
        }

        $scope.incrementComment = function(comment){
            comment.upvotes += 1;
        }
    }
]);