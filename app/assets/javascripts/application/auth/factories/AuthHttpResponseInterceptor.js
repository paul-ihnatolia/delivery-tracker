angular.module('dtracker')
  .factory('authHttpResponseInterceptor',['$q','$location', '$rootScope', 'flash', 
      function($q, $location, $rootScope, flash){
      return {
          response: function(response){
              if (response.status === 401) {
                  console.log("Response 401");
              }
              return response || $q.when(response);
          },
          responseError: function(rejection) {
              if (rejection.status === 401) {
                  console.log("Response Error 401",rejection);
                  $rootScope.flash = flash;
                  $rootScope.flash.setMessage("You need to login in order to continue");
                  $location.path('/auth/sign_in').search('returnTo', $location.path());
              }
              return $q.reject(rejection);
          }
      };
  }]);