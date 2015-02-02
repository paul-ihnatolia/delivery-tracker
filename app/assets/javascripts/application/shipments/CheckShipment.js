angular.module('dtracker')
  .factory('CheckShipment', ['uiCalendarConfig', function (uiCalendarConfig) {
    return {
      isOverlapping: function(event){
        var array = uiCalendarConfig.calendars.myCalendar.fullCalendar('clientEvents');
        for(var i = 0; i < array.length; i++) {
          if(array[i]._id != event.id){
            if (moment.utc(array[i].start) <= moment.utc(event.start) && moment.utc(array[i].end) > moment.utc(event.start)) {
              return true;
            }
          }
        }
        return false;
      }
    };
  }]);