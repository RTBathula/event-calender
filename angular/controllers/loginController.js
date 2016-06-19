'use strict';

app.controller('loginController', ['$scope','$q', function ($scope, $q) {

  $scope.login=function(){
  	if($scope.login.username=="admin" && $scope.login.password=="secretpassword"){
  		$.cookie('username', $scope.login.username, { expires: 29,path: '/' });      
   		window.location.href="#/admin-dashboard"; 
  	}else{
  		errorNotify("Invalid credentials");
  	}        
  };  	

}]);

