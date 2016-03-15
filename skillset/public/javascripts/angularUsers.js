/**
 * Created by kprasad on 3/15/16.
 */

var app = angular.module('user-add', ['ui.router']);


app.factory('employees', ['$http', function($http){
    var o = { employee: [] };

    //This is for a POST of a new post
    o.addEmpl = function(employee){
        return $http.post('/users/add', employee).success(function(data){
            //This is for just our front end so it doesn't always go back to the server
            o.employee.push(data);
        });
    }

    return o;
}]);

app.controller('UserAdd', [
    '$scope',
    'employees',
    function($scope, employees){

        $scope.addEmployee = function(){
            employees.addEmpl({ name: $scope.name, skill: $scope.skill,
                                phone: $scope.phone, id: $scope.id});

            alert("Employee totally added!");
        }

}]);