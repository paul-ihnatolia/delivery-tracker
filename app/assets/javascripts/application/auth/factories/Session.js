angular.module('dtracker')
.factory('Session', ['$auth', '$rootScope', function ($auth, $rootScope) {
  
  var currentUser;

  var session = {
    create: function (user) {
      currentUser = user;
      $rootScope.$broadcast('session:change');
    },
    destroy: function () {
      currentUser = null;
    },
    getCurrentUser: function () {
      //$auth.validateUser();
      return currentUser;
    }
  };

  $rootScope.$on("auth:validation-success", function (e, user) {
    console.log("auth:validation-success");
    session.create(user);
  });

  $rootScope.$on("auth:email-confirmation-succes", function (e) {
    console.log("auth:email-confirmation-succes");
    console.log(e);
  });

  // reset current user after logout
  $rootScope.$on("logout-success", function () {
    console.log("logout-success => session");
    session.destroy();
  });

  // reset when token is expired
  $rootScope.$on("auth:invalid", function () {
    console.log("auth:invalid => session");
    session.destroy();
  });

  return session;
}]);