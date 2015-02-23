(function () {
  'use strict';
  angular.module('dtracker')
    .controller('CalendarSettingsCtrl', ['$scope', '$http',
      function ($scope, $http) {
      var calendarSettings = this;
      calendarSettings.slot_duration = '00:40:00';

      calendarSettings.setSlotDuration = function () {
        // 01:00:00
        // 60
        $http.put('/api/calendar_settings',
          { calendar_setting:
            {
              slot_duration: calendarSettings.slot_duration
            }
          })
        .success(function(data, status, headers, config) {
          // Notify about success
          // Update attribute
          $('.settings').data('slot-duration', calendarSettings.slot_duration);
          var times = calendarSettings.slot_duration.split(':');
          var minutes = parseInt(times[0], 10) * 60 + parseInt(times[1], 10);
          $('.settings').data('schedule-interval', minutes);
        })
        .error(function(data, status, headers, config) {
          //alert();
        });
      };
    }]);
}());