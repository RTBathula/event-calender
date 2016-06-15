'use strict';

app.controller('eventsController', ['$scope','$q', 'eventService', 'NgMap',
	function ($scope, $q,eventService,NgMap) {

	$scope.eventsMap=[];
	$scope.activeCategory="CatA";	

    $scope.init=function(){       
        getAllEvents().then(function(list){
        	$scope.eventListCatA=[];
        	$scope.eventListCatB=[];
            if(list && list.length){
	           	for(var i=0;i<list.length;++i){
	           		if(list[i].category=="CatA"){
	           			$scope.eventListCatA.push(list[i]);
	           		}
	           		if(list[i].category=="CatB"){
	           			$scope.eventListCatB.push(list[i]);
	           		}
	           	}
           }
           //Active markers on map
           $scope.toggleCategory($scope.activeCategory);
        },function(error){
        });
    };

    $scope.toggleCategory=function(category){
    	if(category=="CatA"){
    		$scope.activeCategory="CatA";
    		$scope.eventsMap=angular.copy($scope.eventListCatA);
    	}else if(category=="CatB"){
    		$scope.activeCategory="CatB";
    		$scope.eventsMap=angular.copy($scope.eventListCatB);
    	}
    };

    $scope.weDontLike = function(name) {
	    return function(friend) {
	        return friend.name != name;
	    }
	};

    /******Private Functions********/
    function getAllEvents(){
        var q=$q.defer();
        eventService.getAllEvents().then(function(list){
            q.resolve(list);
        },function(error){
            q.reject(error);
        });
        return  q.promise;
    }

}]);

