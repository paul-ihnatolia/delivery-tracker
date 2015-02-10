angular.module('dtracker')
.factory('Session', ['$auth', '$rootScope', '$q', 'UserDecorator',
  function ($auth, $rootScope, $q, UserDecorator) {
  
  var currentUser;

  var session = {
    create: function (user) {
      currentUser = new UserDecorator(user);
      $rootScope.$emit('session:change', currentUser);
    },
    destroy: function () {
      currentUser = null;
      $rootScope.$emit('session:change', currentUser);
    },
    getCurrentUser: function () {
      return currentUser;
    },
    authPromise: {}
  };

  $rootScope.$on('auth:login-success', function (ev, user) {
    // alert('auth login-success');
    // session.create(user);
  });

  $rootScope.$on("auth:validation-success", function (e, user) {
    console.log("auth:validation-success");
    //session.create(user);
  });

  $rootScope.$on("auth:email-confirmation-succes", function (e) {
    console.log("auth:email-confirmation-succes");
    console.log(e);
  });

  // reset current user after logout
  $rootScope.$on("auth:logout-success", function () {
    //session.destroy();
  });

  // reset when token is expired
  $rootScope.$on("auth:invalid", function () {
    //session.destroy();
  });

  return session;
}]);