angular.module('dtracker')
  .factory('CheckShipment', ['uiCalendarConfig', function (uiCalendarConfig) {
    return {
      isOverlapping: function(event, category){
        var calendar = null;
        if (category) {
          if (category == 'shipping') {
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
            if (moment(array[i].start) < moment(event.end_date) && moment(array[i].end) > moment(event.start_date)) {
              return true;
            }
          }
        }
        return false;
      }
    };
  }]);