(function () {
  var dtracker = angular.module('dtracker');
  dtracker.factory('user', ['$rootScope', function ($rootScope) {
    var currentUser;
  
    var userFactory = {
      setCurrentUser: function (user) {
        currentUser = user;
        $rootScope.$emit('user:change');
      },
      clearUser: function () {
        currentUser = null;
        $rootScope.$emit('user:change');
      },
      getCurrentUser: function () {
        return currentUser;
      }
    };
    
    $rootScope.$on('auth:login-success', function (ev, user) {
      userFactory.setCurrentUser(user);
    });

    $rootScope.$on("auth:validation-success", function (e, user) {
      userFactory.setCurrentUser(user);
      alert("auth:validation-success");
    });

    $rootScope.$on("auth:email-confirmation-succes", function (e) {
      console.log(e);
      alert("auth:email-confirmation-succes");
    });

    // reset current user after logout
    $rootScope.$on("auth:logout-success", function () {
      alert("logout-success => session");
      userFactory.clearUser();
    });

    // reset when token is expired
    $rootScope.$on("auth:invalid", function () {
      alert("auth:invalid => session");
      userFactory.cleanUser();
    });

    return userFactory;
  }]);
}());