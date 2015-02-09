// /**
//  * Created by paul on 1/16/15.
//  */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", 'Session', '$state',
  function ($http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig, session, $state) {
    // Duration of event
    var shipmentsInterval = parseInt($('.settings').data("schedule-interval"), 10);
    var slotDuration = "00:30:00";
    // Events for calendar
    $scope.events = [];
    // Assign events sources to calendar.
    $scope.eventSources =  [$scope.events];
    $scope.activeShipment = 'shipping';
    var shippingEvents = [];
    var receivingEvents = [];
    /* Render calendar */
    $scope.changeView = function (calendarName, view) {
      uiCalendarConfig.calendars[calendarName].fullCalendar('changeView',view);
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
          slotDuration: slotDuration,
          header:{
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          // it will passe clicked date into function
          dayClick: $scope.createShipment,
          eventClick: $scope.editShipment
        }
      };

      if (user.hasRole('carrier')) {
        Shipment.query().$promise.then(function(data) {
          shippingEvents = [];
          receivingEvents = [];
          var source = null;
          angular.forEach(data, function (r) {
            if (r.status === 'shipping') {
              source = shippingEvents;
            } else {
              source = receivingEvents;
            }

            source.push({
              sid: r.id,
              start: r.start_date,
              end: r.end_date,
              title: r.po + ' - ' + r.company,
              allDay: false,
              color: r.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)"
            });

          });
          //$scope.events.splice(0, $scope.events.length);
          changeShipmentSource();
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
              sid: r.id,
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
    
    // Watch on active shipment status change
    $scope.$watch("activeShipment", function () {
      changeShipmentSource();
    });

    function changeShipmentSource () {
      $scope.eventSources.pop();
      if ($scope.activeShipment === 'shipping') {
        $scope.eventSources.push(shippingEvents);
      } else {
        $scope.eventSources.push(receivingEvents);
      }
    }

    function getActiveShipments () {
      if ($scope.activeShipment === 'shipping') {
        return shippingEvents;
      } else {
        return receivingEvents;
      }
    }

    // function calculateSlot(minutes) {
    //   var hours = Math.floor( minutes / 60);
    //   var minutes = $('.totalMin').html() % 60;
      
    // }
    $scope.createShipment = function(date){
      $state.go('application.shipments.newShipment');
      setTimeout(function () {
        $rootScope.$emit("shipment:create", {start: date, interval: shipmentsInterval});
      }, 100);
    };

    $scope.editShipment = function (data) {
      console.log("Edit shipment");
      $state.go('application.shipments.editShipment');
      setTimeout(function () {
        $rootScope.$emit("shipment:edit", data);
      }, 100);
    };

    $scope.addShipmentToCalendar = function (e, data) {
      var events = getActiveShipments();
      events.push(data.shipment);
    };

    $scope.updateEvent = function (e, data) {
      var events = getActiveShipments();
      console.log(events);
      angular.forEach(events, function(e, i) {
        if (e.sid === data.sid ) {
          var newEvent = {};
          angular.extend(newEvent, e, { title: data.po + ' - ' + data.company, sid: e.sid});
          events.splice(i, 1);
          events.push(newEvent);
        }
      });
      console.log(events);

      uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents');
    };

    $rootScope.$on('addShipmentToCalendar', $scope.addShipmentToCalendar);
    $rootScope.$on('shipment:updateEvent', $scope.updateEvent);

    // When user is resolved
    session.authPromise.then(function (user) {
      init(session.getCurrentUser());
    });
  }]);
