/**
 * Created by kprasad on 3/15/16.
 */

var app = angular.module('user-add', ['ui.router']);


app.factory('employees', ['$http', function($http){
    var o = { employee: [] };

    //This is for a POST of a new post
    o.create = function(post){
        return $http.post('/posts', post).success(function(data){
            o.posts.push(data);
            //This is for just our front end so it doesn't always go back to the server
        });
    }

    return o;
}]);

app.controller('UserAdd', [
    '$scope',
    'employees'
    function($scope, employees){

        $scope.addEmployee() = function(){
            console.log("In add emp");

            alert("Employee totally added!");
        }

}]);