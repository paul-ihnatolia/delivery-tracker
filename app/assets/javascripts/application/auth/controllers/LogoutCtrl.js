(function () {
  'use strict';
  angular.module('dtracker').controller('LogoutCtrl', ['$rootScope', '$auth', '$location', 'flash', 'Session',
   function ($rootScope, $auth, $location, flash, session) {
    function logout () {
      $auth.signOut()
        .then(function(resp) {
          session.destroy();
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