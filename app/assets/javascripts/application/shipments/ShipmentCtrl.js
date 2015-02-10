// /**
//  * Created by paul on 1/16/15.
//  */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", 'Session', '$state',
  function ($http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig, session, $state) {
    // Duration of event
    var shipmentsInterval = parseInt($('.settings').data("schedule-interval"), 10);
    var slotDuration = "00:30:00";
    var carrier = {};
    var admin = {};
    // Events for calendar
    $scope.events = [];
    // Assign carrier events sources to calendar.
    $scope.eventSources =  [];
    // Assign admin event sources
    $scope.shippingSources =  [];
    $scope.receivingSources = [];

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
        // For carrier
        $scope.activeShipment = 'shipping';
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
        var shippingEvents = [];
        var receivingEvents = [];
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
      // Hide edit or show form
      //$state.go("application.shipments");
      changeShipmentSource();
    });

    // Change events source, when shipment status changed
    function changeShipmentSource () {
      // It fails first time, so wee need to
      // make a check
      var calendar = getCalendar();
      if (calendar) {
        if ($scope.activeShipment === 'shipping') {
          calendar.fullCalendar( 'removeEventSource',  receivingEvents);
          calendar.fullCalendar( 'addEventSource',  shippingEvents);
         // $scope.eventSources.push(shippingEvents);
        } else {
          calendar.fullCalendar( 'removeEventSource',  shippingEvents);
          calendar.fullCalendar( 'addEventSource',  receivingEvents);
  //        $scope.eventSources.push(receivingEvents);
        }
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
        $rootScope.$emit("shipment:create", {start: date,
                                              interval: shipmentsInterval,
                                              status: $scope.activeShipment});
      }, 100);
    };

    $scope.editShipment = function (data) {
      $state.go('application.shipments.editShipment');
      setTimeout(function () {
        $rootScope.$emit("shipment:edit", data);
      }, 100);
    };

    $scope.addShipmentToCalendar = function (e, data) {
      var calendar = getCalendar();
      var events = getActiveShipments();
      // Algorithm works next:
      // firstly remove all sources from fullcalendar,
      // than add event to source, and then add that source again
      calendar.fullCalendar( 'removeEventSource',  events);
      events.push(data.shipment);
      uiCalendarConfig.calendars.myCalendar.fullCalendar('addEventSource', events);
    };

    $scope.updateEvent = function (e, data) {
      var events = uiCalendarConfig.calendars.myCalendar.fullCalendar('clientEvents');
      var sourceEvents = getActiveShipments();
      angular.forEach(events, function(e, i) {
        if (e.sid === data.sid ) {
          e.title = data.po + ' - ' + data.company;
          uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvent', e);
        }
      });
      
      // Also update event in source
      for (var i = 0; i < sourceEvents.length; i++) {
        if (sourceEvents[i].sid === data.sid) {
          sourceEvents[i].title = data.po + ' - ' + data.company;
          break;
        }
      }
    };

    $scope.deleteEvent = function (e, data) {
      var sid = data.sid;
      var _id = data._id;
      var calendar = getCalendar();
      calendar.fullCalendar('removeEvents', _id);
      var events = getActiveShipments();
      // Also remove it manually from event source
      for (var i = 0; i < events.length; i++) {
        if(events[i].sid === sid){
          events.splice(i, 1);
          break;
        }
      }
    };

    $rootScope.$on('addShipmentToCalendar', $scope.addShipmentToCalendar);
    $rootScope.$on('shipment:updateEvent', $scope.updateEvent);
    $rootScope.$on('shipment:deleteEvent', $scope.deleteEvent);

    function getCalendar() {
      return uiCalendarConfig.calendars.myCalendar;
    }
    // When user is resolved
    session.authPromise.then(function (user) {
      init(session.getCurrentUser());
    });
  }]);
