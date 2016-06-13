'use strict';

app.controller('loginController', ['$scope','$q', function ($scope, $q) {

  $scope.login=function(){
    $.cookie('username', $scope.login.username, { expires: 29,path: '/' });      
    window.location.href="http://localhost:1447/#/admin-dashboard";    
  };

}]);

