app.config([
  '$urlRouterProvider',
  '$stateProvider',
  '$httpProvider',    
  function($urlRouterProvider,$stateProvider,$httpProvider){

  $urlRouterProvider.otherwise('/');  

  $stateProvider.state('events',{
    url:'/',
    templateUrl:'angular/views/events.html'              
  }); 

  $stateProvider.state('login',{
    url:'/login',
    templateUrl:'angular/views/login.html',
    controller: 'loginController'               
  });

  $stateProvider.state('adminDashboard',{
    url:'/admin-dashboard',
    templateUrl:'angular/views/admin-dashboard.html',
    controller: 'adminDashboardController'              
  });       

  //cors.
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];   

}]);

app.filter('formatstartdate', function($rootScope) {
  return function(startdate) {
    if(startdate){
      var dateParts=startdate.split("-");
      return dateParts[2]+"."+dateParts[1];
    }       
  }
});

app.filter('formatenddate', function($rootScope) {
  return function(enddate) {
    if(enddate){
      var dateParts=enddate.split("-");
      return dateParts[2]+"."+dateParts[1]+"."+dateParts[0];
    }       
  }
});

