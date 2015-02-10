(function () {
  angular.module('dtracker')
  .factory('UserDecorator', [function () {
    function UserDecorator (user) {
      this.user = user;
    }

    UserDecorator.prototype.hasRole = function (role_list) {
      if (typeof role_list != 'string') {
        throw 'role_list argument should be a string';
      }

      var roles = role_list.split(',').map(function (el) {
        return el.trim();
      });

      if (this.user) {
        var role = this.getRole();
        for (var i = 0; i < roles.length; i++) {
          if (role === roles[i]) {
            return true;
          }
        }
      } else {
        throw "User is empty";
      }
      return false;
    };
    
    UserDecorator.prototype.getRole = function () {
      return this.user ? this.user.role : null;
    };

    UserDecorator.prototype.getEmail = function () {
      return this.user.email;
    };
    return (UserDecorator);
  }]);

}());