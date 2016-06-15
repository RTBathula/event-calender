app.controller('indexController',	['$scope','$rootScope','$q',function($scope,$rootScope,$q){	
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
		
}]);
