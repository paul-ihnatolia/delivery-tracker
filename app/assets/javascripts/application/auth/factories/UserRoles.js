(function () {
  'use strict';
  angular.module('dtracker')
  .factory('userRoles', ['$rootScope', 'Session',
    function ($rootScope, session) {
  
    return {
      hasRole: function (roles) {
        var currentUser = session.getCurrentUser();
        if (currentUser) {
          var role = currentUser.role;
          for (var i = 0; i < roles.length; i++) {
            if (role === roles[i])
              return true;
          }
        }
        return false;
      }
    };
  }]);
}());