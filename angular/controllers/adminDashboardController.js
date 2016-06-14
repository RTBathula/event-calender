'use strict';

app.controller('adminDashboardController',
    ['$scope','$q','NgMap','GeoCoder','eventService',
	function ($scope, $q,NgMap,GeoCoder,eventService) {  
       
    $scope.categoryList=["CatA","CatB"]; 
    $scope.searchAddress=null;
	$scope.eventList=[];
	$scope.toggleEventEdit={};

    $scope.init=function(){
    	$scope.userName=$.cookie('username');
    	$scope.addNewEventFormShow=false;
        _initAddEventDefaultForm()
   		_getCountries().then(function(countriesJson){
   			$scope.countryList=countriesJson;                         			
   		});

        getAllEvents().then(function(list){
            $scope.eventList=list;
        },function(error){

        });
    };

    $scope.addEvent=function(){
        var errorMessage=_validateEventFields($scope.addNewEventForm);
        if(errorMessage){
            errorNotify(errorMessage);
        }
        if(!errorMessage){
            $scope.addEventSpinner=true; 

            for (var key in $scope.countryList) {
                if ($scope.countryList.hasOwnProperty(key) && $scope.countryList[key].name==$scope.addNewEventForm.country) {
                  $scope.addNewEventForm.country=key;
                  break;
                }
            } 

            $scope.addNewEventForm.sortOrder=$scope.eventList.length+1;

            eventService.addEvent($scope.addNewEventForm).then(function(resp){
                $scope.addEventSpinner=false;
                successNotify("Successfully added new event.");
                $scope.eventList.push(resp);
                _initAddEventDefaultForm();
                $scope.addNewEventFormShow=false;

            },function(error){
                $scope.addEventSpinner=false;
                errorNotify("Error on adding a new event.");
            });
        }        
    };

    $scope.addNewEventToggle=function(){
    	if($scope.addNewEventFormShow){
    		$scope.addNewEventFormShow=false;
    	}else{
    		$scope.addNewEventFormShow=true;          
    	}    	
    };

    $scope.deleteEvent=function(eventId){
        eventService.deleteEvent(eventId).then(function(resp){
            var deleteIndex;
            for(var i=0;i<$scope.eventList.length;++i){
                if($scope.eventList[i]._id==eventId){
                    deleteIndex=i;
                    break;
                }
            }
            if(deleteIndex>-1){
                $scope.eventList.splice(deleteIndex,1);
            }
        },function(error){
            errorNotify("Unable to delete event now..try again.");
        });
    };

    $scope.toggleEvent=function(eventId,bool){
        for(var i=0;i<$scope.eventList.length;++i){
            $scope.toggleEventEdit[$scope.eventList[i]._id]=false;
        }
    	$scope.toggleEventEdit[eventId]=bool;
    };

    $scope.getAddEventCoordinates=function(){
        _getCoordinates($scope.searchAddress).then(function(coordinates){
            $scope.addNewEventForm.coordinates=coordinates;
        });    	
	};

	$scope.dragControlListeners = {
	    accept: function (sourceItemHandleScope, destSortableScope) {
           $scope.cloneEventList=angular.copy($scope.eventList);
	       return true;
	    },	   
	    dragEnd : function(event) {
	    	var destIndex=event.dest.index;
            var sourceIndex=event.source.index;           
            
            //Sort
            $scope.cloneEventList.sort(function(a,b){
                return parseInt(a.sortOrder) - parseInt(b.sortOrder);
            });

            $scope.cloneEventList[sourceIndex].sortOrder=destIndex+1;
            //Update SortOrder change to backend
            eventService.updateEventById($scope.cloneEventList[sourceIndex]._id,{sortOrder:$scope.cloneEventList[sourceIndex].sortOrder});
            
            if(sourceIndex>destIndex){
                //Change order of all remaining items           
                for(var i=destIndex;i<sourceIndex;++i){
                    $scope.cloneEventList[i].sortOrder=i+2;
                    //Update SortOrder change to backend
                    eventService.updateEventById($scope.cloneEventList[i]._id,{sortOrder:$scope.cloneEventList[i].sortOrder});
                }
            }

            if(destIndex>sourceIndex){
                for(var i=destIndex;i>sourceIndex;--i){
                    $scope.cloneEventList[i].sortOrder=i;
                    //Update SortOrder change to backend
                    eventService.updateEventById($scope.cloneEventList[i]._id,{sortOrder:$scope.cloneEventList[i].sortOrder});
                }
            }            
            
            //Assign new Order
            $scope.eventList=angular.copy($scope.cloneEventList);
            $scope.cloneEventList=[];
	    },   
	    allowDuplicates: true
	};	

    $scope.markerDropped=function(){
    	console.log("fcf");    	
    };

    $scope.logOut=function(){
   	  $.removeCookie('username', { path: '/' });
      window.location.href="/#/login";
    };

    NgMap.getMap().then(function(map) {
    	google.maps.event.trigger( map, 'resize' );   	
  	});

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

    function _initAddEventDefaultForm(){
        //New Event Object
        $scope.addNewEventForm={
            title       : null,
            description : null,
            address     : null,
            zip         : null,
            country     : "select-country",
            startDate   : null,
            endDate     : null,
            category    : "select-category",
            coordinates : [47.795402,13.302220],//Default to Austria                      
            rsvp        : 0,
            sortOrder   : 0
        };
    }

    function _validateEventFields(eventObject){
        if(!eventObject.title){
            return "Event title is required.";
        }
        if(!eventObject.description){
            return "Event description is required.";
        }
        if(!eventObject.address){
            return "Event address is required.";
        }
        if(!eventObject.zip){
            return "Event zip is required.";
        }
        if(eventObject.country=="select-country"){
            return "Event country is required.";
        }
        if(!eventObject.startDate){
            return "Event start date is required.";
        }
        if(!eventObject.endDate){
            return "Event end date is required.";
        }
        if(eventObject.startDate){
            var startDateTimeStamp=angular.copy(new Date(eventObject.startDate).getTime());
            var currentTimeStamp=new Date().getTime();
            if(startDateTimeStamp<currentTimeStamp){
                return "Event start date should be same or more than current Time.";
            }
        }

        if(eventObject.startDate && eventObject.endDate){
            var startDateTimeStamp=angular.copy(new Date(eventObject.startDate).getTime());
            var endDateTimeStamp=angular.copy(new Date(eventObject.endDate).getTime());
            if(endDateTimeStamp<=currentTimeStamp){
                return "Event end date shouldn't be same or less than start date.";
            }
        }

        if(eventObject.category=="select-category"){
            return "Event category is required.";
        }
        if(!eventObject.coordinates[0] || !eventObject.coordinates[1]){
            return "Event latitude and longitude is required.";
        }
        return null;
    }

    function _getCoordinates(searchString){
        var q=$q.defer();
       
        GeoCoder.geocode({address: searchString}).then(function(results) {  
            var lat = results[0].geometry.location.lat();
            var long = results[0].geometry.location.lng(); 
            q.resolve([lat,long]);                
        });

        return  q.promise;
    }

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

