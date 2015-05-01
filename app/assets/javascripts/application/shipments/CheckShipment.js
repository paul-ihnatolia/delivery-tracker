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

              var eventStart = moment(event.start_date).format('MMMM Do YYYY, h:mm:ss');
              var eventEnd = moment(event.end_date).format('MMMM Do YYYY, h:mm:ss');
              var arrayEventStart = moment(array[i].start).format('MMMM Do YYYY, h:mm:ss');
              var arrayEventEnd = moment(array[i].end).format('MMMM Do YYYY, h:mm:ss');

            if (arrayEventStart < eventEnd && arrayEventEnd > eventStart) {
              return true;
            }
          }
        }
        return false;
      }
    };
  }]);