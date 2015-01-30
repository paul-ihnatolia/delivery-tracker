(function () {
  'use strict';
  angular.module('dtracker').controller('ForgotPassCtrl', ['$rootScope', '$scope', '$auth', 'flash', '$location',
    function ($rootScope, $scope, $auth, flash, $location) {
    var forgot = this;
    forgot.credentials = {
      email: ''
    };

    forgot.resetPass = function (isValid) {
      if (isValid) {
        $auth.requestPasswordReset(forgot.credentials);
      } else {
        alert('Form is not valid. Please, fill all fields!');
      }
    };

    $scope.$on("auth:password-reset-request-success", function (ev, data) {
      $rootScope.flash = flash;
      $rootScope.flash.setMessage("Password reset instructions were sent to " + data.email);
      $location.path('/auth/sign-in');
    });

    $scope.$on('auth:password-reset-request-error', function (ev, resp) {
      $scope.errors = resp.errors;
    });
  }]);
}());