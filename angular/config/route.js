app.config([
  '$urlRouterProvider',
  '$stateProvider',
  '$httpProvider',    
  function($urlRouterProvider,$stateProvider,$httpProvider){

  $urlRouterProvider.otherwise('/');  

  $stateProvider.state('events',{
    url:'/',
    templateUrl:'angular/views/events.html', 
    controller: 'eventsController'                 
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

app.filter('getcountrycode', function($rootScope) {
  return function(name) {
    if(name){
      for (var key in $rootScope.countryList) {
        if ($rootScope.countryList.hasOwnProperty(key) && $rootScope.countryList[key].name==name) {
          return key;
          break;
        }
      }
    }       
  }
});

app.filter('limittext', function($rootScope) {
  return function(text) {
    if(text){
      var ElmContent=text;
      if(ElmContent.length>12){
          var trimmedString=ElmContent.substring(0, 12);
          trimmedString=trimmedString+"...";
          return trimmedString;
      }else{
        return text;
      }
    }       
  }
});


