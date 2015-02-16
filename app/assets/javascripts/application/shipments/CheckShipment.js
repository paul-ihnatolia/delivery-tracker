angular.module('dtracker')
  .factory('CheckShipment', ['uiCalendarConfig', function (uiCalendarConfig) {
    return {
      isOverlapping: function(event, status){
        var calendar = null;
        if (status) {
          if (status == 'shipping') {
            calendar = uiCalendarConfig.calendars.shippingCal;
          } else {
            calendar = uiCalendarConfig.calendars.receivingCal;
          }
        } else {
          calendar = uiCalendarConfig.calendars.myCalendar;
        }
        var array = calendar.fullCalendar('clientEvents');
        for(var i = 0; i < array.length; i++) {
          if(array[i]._id != event.id){
            if (moment.utc(array[i].start) <= moment.utc(event.start_date) && moment.utc(array[i].end) > moment.utc(event.end_date)) {
              return true;
            }
          }
        }
        return false;
      }
    };
  }]);