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

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('search');
                }
            }]
        })
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('search');
                }
            }]
        });

        //For everything else, route to home, for now
        $urlRouterProvider.otherwise('search');
    }
]);



//////////////////////////////////////////////////FACTORIES/////////////////////////////////////
//Factory for authentication
app.factory('auth', ['$http', '$window', function($http, $window){
    var auth = {};

    //Leverage local storage
    auth.saveToken = function (token){
        $window.localStorage['skillset-site-token'] = token;
    };
    auth.getToken = function (){
        return $window.localStorage['skillset-site-token'];
    }

    //Find out if user is logged in or not
    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    //Get the current user of this site
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.username;
        }
    };

    //Create the registration function
    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    //Create the login function
    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    //Create logouts
    auth.logOut = function(){
        $window.localStorage.removeItem('skillset-site-token');
    };

    return auth;
}])

app.factory('employees', ['$http', 'auth', function($http, auth){
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
        return $http.post('/profile/' + emp_id, skill, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            o.employees[id].skills.push(data); //TODO: Test this
            //This is for just our front end so it doesn't always go back to the server
        });
    }

    //Post one comment
    o.postComment = function(comment, emp_id, skill_id){ //both these are mongo IDs
        return $http.post('/profile/'+ emp_id + '/skill/' + skill_id, comment, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            //TODO: update
        });
    }

    //Upvote a skill
    o.upvoteSkill = function(emp_id, skill_id, skill){
        $http.put('/profile/' + emp_id +'/skill/' + skill_id + '/upvote', null, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            //and for the front end`
            skill.upvotes += 1;
        });
    }

    //Upvote a comment
    o.upvoteComment = function(emp_id, skill_id, comment){
        $http.put('/profile/' + emp_id +'/skill/' + skill_id + '/comment/' + comment._id +'/upvote', null, {
                headers: {Authorization: 'Bearer '+auth.getToken()}
            }).success(function(data){
                //and for the front end
                comment.upvotes += 1;
        });
    }


    //Finally return the object
    return o;
}]);


//Now define our controllers
//////////////////////////////////////////////////CONTROLLERS/////////////////////////////////////
//define a controller for authentication
app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('search');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('search');
            });
        };
    }
]);

//define a controller for navigation
app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }]);

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
    'auth',
    function($scope, $stateParams, employees, employee, auth){
        $scope.employee = employee;

        $scope.isLoggedIn = auth.isLoggedIn;


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
    'auth',
    function($scope, $stateParams, employees, employee, skill, auth){
        //First, get the relevant skill - promise?

        $scope.isLoggedIn = auth.isLoggedIn;

        $scope.employee = employee;
        $scope.skillDetail = skill;
        $scope.skills = employee.skills;

        $scope.addComment = function(){
            if($scope.body === '') { return;}
            //Now post the comment
            employees.postComment({ body: $scope.body, author: 'user', upvotes: 0}, employee._id, $stateParams.skillId)
                .success(function(comment){
                    $scope.skillDetail.comments.push(comment);
                });

            //Then add a comments element into a comments array, on the skill object
            //A comment looks like this comments = [ {body:sometext, author:text, upvotes:0}]
            $scope.body = "";
        }

        $scope.incrementComment = function(comment){
            employees.upvoteComment(employee._id, skill._id, comment);
        }
    }
]);