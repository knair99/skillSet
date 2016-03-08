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
        $stateProvider.state('comments', {url:'/skill/:employeeId/:skillId',
                templateUrl:'/comments.html',
                controller:'CommentCtrl'
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

    //Post one skill
    o.create = function(skill, id){
        return $http.post('/profile/' + id, skill).success(function(data){
            o.employees[1].skills.push(data); //todo: FIX THIS
            //This is for just our front end so it doesn't always go back to the server
        });
    }

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

            employees.create({skill: $scope.skill, link: $scope.link}, $stateParams.id)
                .success(function(skill) {
                $scope.employee.skills.push(skill);
            });
            //Blank out scope data for the next time
            $scope.skill = "";
            $scope.link = "";
        }

        $scope.incrementUpvotes = function(skill){
            skill.upvotes += 1;
        }
}]);

//define a controller for our posts
app.controller('CommentCtrl', [
    '$scope',
    '$stateParams',
    'employees',
    function($scope, $stateParams, employees){

        $scope.addComment = function(){
            if($scope.body === '') {return;}

            //First, get the relevant post
            $scope.employee = employees.employees[$stateParams.employeeId];

            $scope.skillDetail = employees.employees[$stateParams.employeeId].skills[$stateParams.skillId];

            //Then add a comments element into a comments array, on the post object
            //A comment looks like this comments = [ {body:sometext, author:text, upvotes:0}]
            $scope.skillDetail.comments.push( { body: $scope.body, author: 'user', upvotes: 0} );
            $scope.body = "";
        }

        $scope.incrementUpvotes = function(comment){
            comment.upvotes += 1;
        }
    }
]);