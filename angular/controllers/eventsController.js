'use strict';

app.controller('eventsController', ['$scope','$q', 'eventService', 'NgMap','$window','screenSize','$http',
	function ($scope, $q,eventService,NgMap,$window,screenSize,$http) {
    
    //Variables
	$scope.eventsMap=[];
    $scope.eventListCatA=[];
    $scope.eventListCatB=[];
    $scope.mapOptions={
        zoom:2,
        center:[40,30]
    };	

    $scope.isMobile=false;
    $scope.isInteractiveMap=true;
    if(screenSize.is('xs')) {
       $scope.isMobile=true;
       $scope.isInteractiveMap=false;
    }
    
    //Map
    NgMap.getMap().then(function(map) {
        $scope.map = map;
    });

    //Init
    $scope.init=function(){   
        $scope.loadingList=true;    
        getAllEvents().then(function(list){        	
            if(list && list.length){

                var catASno=0;
                var catBSno=0;
                var latLngList=[];
	           	for(var i=0;i<list.length;++i){
	           		if(list[i].category=="CatA"){
                        list[i].sno=++catASno;
	           			$scope.eventListCatA.push(list[i]);
                        latLngList.push(list[i].coordinates);
	           		}
	           		if(list[i].category=="CatB"){
                        list[i].sno=++catBSno;
	           			$scope.eventListCatB.push(list[i]);
	           		}
	           	}

                //Static Image for Mobile
                if($scope.isMobile){
                   _getStaticImage("Algeria",2,"768x300","roadmap",latLngList);                  
                }else{
                    //Active markers on map
                    $scope.activeCategory="CatA";
                    $scope.toggleCategory($scope.activeCategory);
                }                
           }
           $scope.loadingList=false;
           
        },function(error){
            errorNotify("Unable to load events list now...try loading again.");
            $scope.loadingList=false;
        });       
    };

    $scope.toggleCategory=function(category){
        if(category!="Category"){
            if(category=="CatA"){
                $scope.activeCategory="CatA";
                $scope.eventsMap=angular.copy($scope.eventListCatA);
            }else if(category=="CatB"){
                $scope.activeCategory="CatB";
                $scope.eventsMap=angular.copy($scope.eventListCatB);
            }
            $scope.isInteractiveMap=true; 
        }else{
            WarningNotify("Please choose category");
        }    	               
    };    

    $scope.placeChanged = function() {
       var place = this.getPlace();
       $scope.isInteractiveMap=true;

       if(_checkAtleastOneMarker(place.geometry.location.lat(),place.geometry.location.lng())){             
            if(!$scope.map){
                NgMap.getMap().then(function(map) {
                    $scope.map = map;                        
                    $scope.map.setCenter(place.geometry.location);
                    $scope.mapOptions.zoom=6;
                    $scope.mapOptions.center=[place.geometry.location.lat(),place.geometry.location.lng()];
                });
            }else{     
                $scope.mapOptions.zoom=6;                
                $scope.map.setCenter(place.geometry.location);                
                $scope.mapOptions.center=[place.geometry.location.lat(),place.geometry.location.lng()];
            }
       }else{
            WarningNotify("No Events found in selected location.");
       }        
                 
    };

    $scope.showDetails=function(e,calenderEvent){        
        if(calenderEvent.category=="CatA"){
            $scope.toggleCategory("CatA");
        }
        if(calenderEvent.category=="CatB"){
            $scope.toggleCategory("CatB");
        }
        $scope.InfoWindowContent=calenderEvent;
        $scope.map.showInfoWindow('infowindowid',calenderEvent._id);
        $window.scrollTo(0, 0);
    };

    $scope.rsvpMe=function(){

        _getFacebookId().then(function(userId){
            if(!userId){
                errorNotify("Please authentic through facebook");
            }
            if(userId){
                eventService.rsvpEvent($scope.InfoWindowContent._id,userId)
                .then(function(resp){
                    successNotify("You have successfully RSVP'd");
                },function(error){
                    errorNotify(error);
                });
            }            
        });             
    };

    $scope.activateInteractiveMap=function(){
        $scope.isInteractiveMap=true;
    };

    $scope.getCurrentLocation=function(){
        navigator.geolocation.getCurrentPosition( function success(pos) {
            var crd = pos.coords;           
            $scope.isInteractiveMap=true;
            if(!$scope.map){
                NgMap.getMap().then(function(map) {
                    $scope.map = map;     
                    var latlng = new google.maps.LatLng(crd.longitude,crd.longitude);                   
                    $scope.map.setCenter(latlng);
                    $scope.mapOptions.zoom=6;
                    $scope.mapOptions.center=[crd.longitude,crd.longitude];
                });
            }else{
                $scope.map.setCenter(latlng);
                $scope.mapOptions.zoom=6;
                $scope.mapOptions.center=[crd.longitude,crd.longitude];
            }          

        }, function error(err) {
          errorNotify('ERROR(' + err.code + '): ' + err.message);
        },{
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
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

    function _getStaticImage(center,zoom,size,mapType,markersList){     

        var baseURL="https://maps.googleapis.com/maps/api/staticmap?";
        baseURL=baseURL+"center="+center;
        baseURL=baseURL+"&zoom="+zoom;
        baseURL=baseURL+"&size="+size;
        baseURL=baseURL+"&maptype="+mapType;
        
        if(markersList && markersList.length){
            baseURL=baseURL+"&markers=color:red";
            for(var i=0;i<markersList.length;++i){
                baseURL=baseURL+"|"+markersList[i][0]+","+markersList[i][1];
            }
        }

        baseURL=baseURL+"&key=AIzaSyCmmRxCtWbVC9ZjU1Zz1maUGqQCjLRz4ks";       
        
        $("#selectd-file-img").attr("src",baseURL);        
    }

    function _checkAtleastOneMarker(lat,lng){   

        var found=false;    
        if($scope.eventListCatA.length>0){
            for(var i=0;i<$scope.eventListCatA.length;++i){
                found=geolib.isPointInCircle(
                    {latitude: lat, longitude: lng},
                    {latitude: $scope.eventListCatA[i].coordinates[0], longitude: $scope.eventListCatA[i].coordinates[1]},
                    5000000
                );

                if(found){
                    $scope.toggleCategory("CatA");
                    break;
                }
            }
        }  

        if(!found && $scope.eventListCatB.length>0){
            for(var i=0;i<$scope.eventListCatB.length;++i){
                found=geolib.isPointInCircle(
                    {latitude: lat, longitude: lng},
                    {latitude: $scope.eventListCatB[i].coordinates[0], longitude: $scope.eventListCatB[i].coordinates[1]},
                    5000000
                );

                if(found){
                    $scope.toggleCategory("CatB");
                    break;
                }
            }
        }

       return found;         
    }

    function _getFacebookId(){
        var q=$q.defer();

        FB.getLoginStatus(function(response) {            
            if (response.status === 'connected') {           
                FB.api('/me', function(response) {
                  q.resolve(response.id);
                });            
            } else {               
                FB.login(function(res){
                    FB.api('/me', function(response) {
                      q.resolve(response.id);
                    });
                });
            }
        });

        return  q.promise;
    }

}]);

