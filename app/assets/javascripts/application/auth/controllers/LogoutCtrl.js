(function () {
  'use strict';
  angular.module('dtracker').controller('LogoutCtrl', ['$rootScope', '$auth', '$location', 'flash',
   function ($rootScope, $auth, $location, flash) {
    function logout () {
      $auth.signOut()
        .then(function(resp) {
          $rootScope.flash = flash;
          $rootScope.flash.setMessage('You successfully logged out.');
          $location.path('/auth/sign-in');
        })
        .catch(function(resp) {
          console.log(resp);
        });
    }
    logout();
  }]);
}());