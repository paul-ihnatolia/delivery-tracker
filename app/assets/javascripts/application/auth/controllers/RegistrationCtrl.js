
var dtracker = angular.module('dtracker');

dtracker.controller('RegistrationCtrl', ['$scope', '$auth', '$location', 'flash', '$rootScope',
  function ($scope, $auth, $location, flash, $rootScope) {
  var registration = this;

  registration.credentials = {
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  };

  registration.signUp = function (isValid) {
    if (isValid) {
      $auth.submitRegistration(registration.credentials);
    } else {
      alert('Form is invalid. Please, fill all necessary fields');
    }
  };

  $scope.$on('auth:registration-email-success', function (ev, message) {
    // Redirect user sign in
    $rootScope.flash = flash;
    $rootScope.flash.setMessage('You successfully created account.');
    $location.path('/shipments');

  });

  $scope.$on('auth:registration-email-error', function (ev, reason) {
    console.log(ev);
    console.log(reason);
    var errors = [];

    if (reason.errors !== undefined && reason.errors.full_messages !== undefined) {
      $.each(reason.errors.full_messages, function(i, el) {
        if($.inArray(el, errors.error) === -1) {
          errors.push(el);
        }
      });
    }
    $scope.errors = errors;
  });
}]);