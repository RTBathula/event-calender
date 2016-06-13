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

    return global;

}]);
