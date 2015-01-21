(function () {
  'use strict';
  angular.module('dtracker').controller('LogoutCtrl', ['$rootScope', '$auth', '$location', 'flash',
   function ($rootScope, $auth, $location, flash) {
    function logout () {
      $auth.signOut()
        .then(function(resp) {
          $rootScope.flash = flash;
          $rootScope.flash.setMessage('You successfuly signed in.');
          $location.path('/auth/sign-in');
        })
        .catch(function(resp) {
          console.log(resp);
        });
    }
    logout();
  }]);
}());