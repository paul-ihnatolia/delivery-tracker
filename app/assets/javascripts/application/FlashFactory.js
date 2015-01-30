(function () {
  'use strict';
  var dtracker = angular.module('dtracker');
  dtracker.factory('flash', ['$rootScope', function ($rootScope) {
    var messageQue = [];
    var currentMessage = "";

    $rootScope.$on("$stateChangeSuccess", function() {
      // Retrieve message
      currentMessage = messageQue.shift() || "";
    });
    
    return {
      setMessage: function (message) {
        messageQue.push(message);
      },
      getMessage: function () {
        return currentMessage;
      }
    };
  }]);
}());