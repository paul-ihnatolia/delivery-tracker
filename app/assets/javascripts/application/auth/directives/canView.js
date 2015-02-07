
var dtracker = angular.module('dtracker');

dtracker.directive('canView', ['$rootScope', 'Session', function ($rootScope, session) {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      if (typeof iAttrs.canView !== "string") {
        throw "canView value must be a string";
      }
      var value = iAttrs.canView.trim();
      
      var notPermissionFlag = value[0] === '!';
      
      if (notPermissionFlag) {
        // Delete leading !
        value = value.slice(1).trim();
      }

      var permittRoles = value;

      function toggleVisibilityBasedOnPermission () {
        var currentUser = session.getCurrentUser();
        if (!currentUser) {
          return false;
        }
        var hasPermission = currentUser.hasRole(permittRoles);

        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
          iElement.show();
        else
          iElement.hide();
      }
      toggleVisibilityBasedOnPermission();
      $rootScope.$on('session:change', function () { toggleVisibilityBasedOnPermission();});
    }
  };
}]);