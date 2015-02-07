// /**
//  * Created by paul on 1/16/15.
//  */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", 'Session', '$q',
  function ($http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig, session) {
    // Events for calendar
    $scope.events = [];
    // Assign events sources to calendar.
    $scope.eventSources =  [$scope.events];
    
    // Re-render calendar view on click
    $scope.changeView = function (view) {
      uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView',view);
    };
    
    // This function will run when user is confirmed
    function init (user) {
      $scope.uiConfig = {
        calendar:{
          editable: user.hasRole('admin') ? true : false,
          allDaySlot: false,
          defaultView: 'agendaDay',
          slotEventOverlap: false,
          minTime: "08:00:00",
          maxTime: "23:00:00",
          slotDuration: '00:05:00',
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          // it will passe clicked date into function
          dayClick: $scope.createShipment
        }
      };

      if (user.hasRole('carrier')) {
        Shipment.query().$promise.then(function(data) {
          angular.forEach(data, function (r) {
            $scope.events.push({
              id: r._id,
              start: r.start_date,
              end: r.end_date,
              title: r.po + ' - ' + r.company,
              allDay: false,
              color: r.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)"
            });
          });
        });
      } else {
        $scope.userEmail = '';
        // Retrieve urls
        $http.get('/api/users')
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.userEmails = data;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('Error happens when retrieving data');
        });
        
        $scope.getEventsByEmail = function (userEmail) {
          Shipment.query({email: userEmail}).$promise.then(function(data) {
          $scope.events.splice(0, $scope.events.length);
          angular.forEach(data, function (r) {
            $scope.events.push({
              id: r._id,
              start: r.start_date,
              end: r.end_date,
              title: r.po + ' - ' + r.company,
              allDay: false,
              color: r.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)"
            });
          });
        });
        };
      }
    }
    
    $scope.createShipment = function(date){
      $rootScope.$emit("showShipmentForm", {start: date});
    };

    $scope.addShipmentToCalendar = function (e, data) {
      $scope.events.push(data.shipment);
    };

    $rootScope.$on('addShipmentToCalendar', $scope.addShipmentToCalendar);

    // When user is resolved
    session.authPromise.then(function (user) {
      init(session.getCurrentUser());
    });
  }]);