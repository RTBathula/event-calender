app.controller('indexController',	['$scope','$rootScope','$q','$location',function($scope,$rootScope,$q,$location){

 	_getCountries().then(function(countriesJson){
   		$rootScope.countryList=countriesJson;                         			
   	});

    function _getCountries(){ 
	    var q=$q.defer();

	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = function(){
	      if(xmlhttp.status === 200 && xmlhttp.readyState === 4){
	        q.resolve(JSON.parse(xmlhttp.responseText));
	      }
	      if(xmlhttp.status !== 200 && xmlhttp.status!==0){
	        q.reject("Failed to load countries");
	      }
	    };
	    xmlhttp.open("GET","node_modules/iso-3166-2.json/iso-3166-2.json",true);
	    xmlhttp.send();

	    return  q.promise;
	}

	//Check Router
    $scope.$watch(function(scope) {
      return $location.path();
    },function(newPath,oldPath) {
    	if(newPath!="/" && newPath!=""){
    		var isLogged=false;

    		//Check Cookie 
    		if(!$.cookie('username') || $.cookie('username')=="null" || $.cookie('username')=="undefined"){
    			isLogged=false;
    		}else if($.cookie('username')){
    			isLogged=true;
    		}

    		//Check Path
    		if(!isLogged){          
	         	window.location.href="/#/login";
	        }else if(isLogged){	
	        	window.location.href="/#/admin-dashboard";          
	        }
    	}
                   
    });	 		
		
}]);
