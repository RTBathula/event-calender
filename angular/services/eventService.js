app.factory('eventService', ['$q','$http',function ($q,$http) {

    var global = {};  

    global.getAllEvents = function(){
      var q=$q.defer();

      $http.get('/event').
      success(function(data, status, headers, config) {
        q.resolve(data);          
      }).
      error(function(data, status, headers, config) {
        q.reject(data);
      });

      return  q.promise;
    };

    global.addEvent = function(eventForm){
      var q=$q.defer();

      $http.post('/event', {data:eventForm}).
      success(function(data, status, headers, config) {
        q.resolve(data);          
      }).
      error(function(data, status, headers, config) {
        q.reject(data);
      });

      return  q.promise;
    }; 

    global.updateEventById = function(eventId,eventObject){
      var q=$q.defer();

      $http.put('/event/'+eventId, {data:eventObject}).
      success(function(data, status, headers, config) {
        q.resolve(data);          
      }).
      error(function(data, status, headers, config) {
        q.reject(data);
      });

      return  q.promise;
    };

    global.deleteEvent = function(eventId){
      var q=$q.defer();

      $http.delete('/event/'+eventId).
      success(function(data, status, headers, config) {
        q.resolve(data);          
      }).
      error(function(data, status, headers, config) {
        q.reject(data);
      });

      return  q.promise;
    }; 

    global.rsvpEvent = function(eventId,userId){
      var q=$q.defer();

      $http.put('event/'+eventId+'/rsvp',{userId:userId}).
      success(function(data, status, headers, config) {
        q.resolve(data);          
      }).
      error(function(data, status, headers, config) {
        q.reject(data);
      });

      return  q.promise;
    };

    return global;

}]);
