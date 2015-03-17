
var dtracker = angular.module('dtracker');

dtracker.controller('SessionCtrl', ['$rootScope', '$scope', '$auth', '$location', 'flash', 'Session',
  function ($rootScope, $scope, $auth, $location, flash, sessionF) {
  var session = this;

  session.credentials = {
    email: '',
    password: ''
  };

  session.signIn = function (isValid) {
    if (isValid) {
      $auth.submitLogin(session.credentials);
    } else {
      alert('Form is not valid. Please, fill all necessary fields.');
    }
  };

  $scope.$on('auth:login-success', function (ev, user) {
    sessionF.create(user);
    $rootScope.flash = flash;
    $rootScope.flash.setMessage('You successfully signed in.');
    if (user.role === "admin") {
      $location.path('/admin/shipments');
    } else {
      $location.path('/shipments');
    }
  });

  $scope.$on('auth:login-error', function (ev, reason) {
    $scope.errors = reason.errors;
  });
}]);