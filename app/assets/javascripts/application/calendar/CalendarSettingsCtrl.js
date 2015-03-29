(function () {
  'use strict';
  angular.module('dtracker')
    .controller('CalendarSettingsCtrl', ['$scope', '$http', 'Flash', function ($scope, $http, Flash) {

      var calendarSettings = this;
      var times = $('.settings').data('slot-duration').split(":");
      var d = new Date();
      d.setHours( parseInt(times[0], 10) );
      d.setMinutes( parseInt(times[1], 10) );
      d.setSeconds( parseInt(times[2], 10));
      calendarSettings.slot_duration = d;
      calendarSettings.message = null;

      calendarSettings.setSlotDuration = function () {

        var slot_duration = moment(calendarSettings.slot_duration).format("HH:mm:ss");

        if (slot_duration == '00:00:00') {

          Flash.create('danger', 'Please set time interval.');
        } else {
          $http.put('/api/calendar_settings',
            { calendar_setting:
              {
                slot_duration: slot_duration
              }
            })
            .success(function() {

              $('.settings').data('slot-duration', slot_duration);
              var times = slot_duration.split(':');
              var minutes = parseInt(times[0], 10) * 60 + parseInt(times[1], 10);
              $('.settings').data('schedule-interval', minutes);

              Flash.create('success', 'Time slot was updates successfully.');
            })
            .error(function() {

              Flash.create('danger', 'Error happened during update.');
            });
        }
      };
    }]);
}());