
// usage <div has-permissions>
angular.module('dtracker').directive('canView', ['userRoles', 'session',
    function (userRoles, session) {
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

      var permittRoles = value.split(',').map(function (el) {
        return el.trim();
      });

      function toggleVisibilityBasedOnPermission () {
        var hasPermission = userRoles.hasRole(permittRoles);

        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
          iElement.show();
        else
          iElement.hide();
      }
      toggleVisibilityBasedOnPermission();
      scope.$on('session:change', function () { console.log('Listening to events'); toggleVisibilityBasedOnPermission();});
    }
  };
}]);