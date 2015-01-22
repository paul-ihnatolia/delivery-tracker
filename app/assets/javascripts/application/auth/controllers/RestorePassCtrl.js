(function () {
  'user strict';
  angular.module('dtracker')
  .controller('RestorePassCtrl', ['$scope', '$rootScope', '$auth', 'flash', '$location',
    function ($scope, $rootScope, $auth, flash, $location) {
    var passRestore = this;
    passRestore.credentials = {
      password: '',
      password_confirmation: ''
    };

    passRestore.restore = function (isValid) {
      if (isValid) {
        $auth.updatePassword(passRestore.credentials)
          .then(function(resp) {
            $rootScope.flash = flash;
            $rootScope.flash.setMessage('You have successfuly changed your password.');
            $location.path('/shipment');
          })
          .catch(function(resp) {
            $scope.errors = resp.errors;
          });
      } else {
        alert("From is invalid. Please, fill all neccessary fields!");
      }
    };
  }]);
}());