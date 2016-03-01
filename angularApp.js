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
        $stateProvider.state('search', {url:'/search', templateUrl:'/search.html', controller:'SearchCtrl'});

        //Angular route to the profile page
        $stateProvider.state('profile', {url:'/profile/{id}', templateUrl:'/profile.html', controller:'ProfileCtrl'});

        //Route to the comments page
        $stateProvider.state('comments', {url:'/skill/:employeeId/:skillId',
            templateUrl:'/comments.html',
            controller:'CommentCtrl',
        });

        //For everything else, route to home, for now
        $urlRouterProvider.otherwise('search');
    }
]);

app.factory('employees', function(){
    var o = {
        employees: [
            {
                id: 0,
                name: 'shailesh',
                title: 'manager',
                phone: '911',
                skills: [{skill: 'C++', link: '', upvotes:0, comments:[]}]
            },
            {
                id: 1,
                name: 'kk',
                title: 'developer',
                phone: '911',
                skills: [{skill: 'C++', link: '', upvotes:0, comments:[]}]
            }
        ]
    };
    return o;
});
//Now define our controller
app.controller('SearchCtrl', [
    '$scope',
    'employees',
    function($scope, employees){

        $scope.searchForSkills = function(){
            if($scope.skill === '') {return;}

            $scope.employees = employees.employees;
        }

}]);

app.controller('ProfileCtrl', [
    '$scope',
    '$stateParams',
    'employees', //here we give the controller the factory
    function($scope, $stateParams, employees){
        $scope.employee = employees.employees[$stateParams.id];

        $scope.addSkill = function(){
            if($scope.skill === '') {return;}

            $scope.employee.skills.push( { skill: $scope.skill, link: $scope.link, upvotes: 0, comments:[]});
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
    }
]);