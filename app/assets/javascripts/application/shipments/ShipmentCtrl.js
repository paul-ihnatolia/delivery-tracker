// /**
//  * Created by paul on 1/16/15.
//  */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['usSpinnerService', '$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", 'Session', '$state', 'CheckShipment',
  function (usSpinnerService, $http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig, session, $state, CheckShipment) {
    // Duration of event
    var shipmentsInterval = parseInt($('.settings').data("schedule-interval"), 10);
    var slotDuration = $('.settings').data("slot-duration");// "00:30:00";
    // Object which contains carrier specific logic
    var carrier = null;
    var admin = null;

    $scope.carrierEventSources =  [];
    $scope.adminShipmentSources = [];
    $scope.adminReceivingSources = [];


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
          eventClick: $scope.editShipment,
          eventResize: $scope.changeTime,
          eventDrop: $scope.changeTime
        }
      };

      if (user.hasRole('carrier')) {
        // Active shippment
        $scope.carrierActiveShipment = 'shipping';
        carrier = {};
        // Watch on active shipment status change
        $scope.$watch("carrierActiveShipment", function () {
          // Hide edit or show form
          $state.go("application.shipments");
          changeShipmentSource();
        });
        Shipment.query().$promise.then(function(data) {
          carrier.shippingEvents = [];
          carrier.receivingEvents = [];

          var source = null;
          angular.forEach(data, function (r) {
            if (r.status === 'shipping') {
              source = carrier.shippingEvents;
            } else {
              source = carrier.receivingEvents;
            }

            var event = {
              allDay: false,
              start: r.start_date,
              end: r.end_date
            };

            if (r.id) {
              event.sid = r.id;
              event.color = r.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
            } else {
              event.color = 'grey';
              event.stub = true;
            }

            if (r.po) {
              event.title = r.po + ' - ' + r.company;
            } else {
              event.title = 'Time is booked';
            }

            source.push(event);
          });
          changeShipmentSource();
        });
      } else {
        // Create data objects and attach them to sources
        admin = {};
        admin.shippings = [];
        //$scope.adminShipmentSources.push(admin.shippings);
        admin.receivings = [];
        //$scope.adminReceivingSources.push(admin.receivings);
        // Retrieve urls
        $http.get('/api/users')
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.shippingUsers = data;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          alert('Error happens when retrieving user data');
        });
        
        // Separate user email for each calendar
        //$scope.receivingUsers = userEmails;

        $scope.$watch('shippingUser', function () {
          // Retrieve data for that user
          getEventsByEmail($scope.shippingUser, 'shipping');
        });

        $scope.$watch('receivingUser', function () {
          // Retrieve data for that user
          getEventsByEmail($scope.receivingUser, 'receiving');
        });
      }
    }


    function getEventsByEmail(userEmail, status) {
      
      usSpinnerService.spin(status);
      Shipment.query({email: userEmail, status: status}).$promise.then(function(data) {
      //$scope.events.splice(0, $scope.events.length);
        var source = null;
        var calendar = getCalendar(status);
        if (status === 'shipping') {
          calendar.fullCalendar('removeEventSource', admin.shippings);
          admin.shippings = [];
          source = admin.shippings;
        } else {
          calendar.fullCalendar('removeEventSource', admin.receivings);
          admin.receivings = [];
          source = admin.receivings;
        }
        angular.forEach(data, function (r) {
          var event = {
            sid: r.id,
            start: r.start_date,
            end: r.end_date,
            title: r.po + ' - ' + r.company,
            allDay: false,
            user: r.user
          };
          if (r.user != userEmail) {
            event.color = 'grey';
          } else {
            event.color = r.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
          }
          source.push(event);
        });
        calendar.fullCalendar('addEventSource', source);

        usSpinnerService.stop(status);
      });
    }

    // Change events source, when shipment status changed for carrier
    function changeShipmentSource () {
      // It fails first time, so wee need to
      // make a check
      var calendar = getCalendar();
      if (calendar) {
        if ($scope.carrierActiveShipment === 'shipping') {
          calendar.fullCalendar( 'removeEventSource',  carrier.receivingEvents);
          calendar.fullCalendar( 'addEventSource',  carrier.shippingEvents);
        } else {
          calendar.fullCalendar( 'removeEventSource',  carrier.shippingEvents);
          calendar.fullCalendar( 'addEventSource',  carrier.receivingEvents);
        }
      }
    }

    function getActiveShipments (status) {
      if (carrier) {
        if ($scope.carrierActiveShipment === 'shipping') {
          return carrier.shippingEvents;
        } else {
          return carrier.receivingEvents;
        }
      } else {
        if (status === 'shipping') {
          return admin.shippings;
        } else {
          return admin.receivings;
        }
      }
    }

    // Only for admin
    $scope.changeTime = function ( event, delta, revertFunc, jsEvent, ui, view ) {
      var status = event.color === "#FF8C00" ? 'shipping' : 'receiving';
      var shipment = {  start_date: moment(event.start).format("YYYY-MM-DD HH:mm:ss z"),
                        end_date: moment(event.end).format("YYYY-MM-DD HH:mm:ss z"),
                        id: event._id,
                        sid: event.sid
                      };
      if (CheckShipment.isOverlapping(shipment, status)) {
        alert('Shipment is overlapping existing!');
        revertFunc();
      } else {
        $http.put('/api/shipments/' + shipment.sid,
            { shipment: shipment })
        .success(function(data, status, headers, config) {
          // Ommit spinner
        })
        .error(function(data, status, headers, config) {
          revertFunc();
        });
      }
    };

    $scope.createShipment = function(date, jsEvent, view){
      var data = {};
      if (admin) {
        var status = $(jsEvent.target).parents('.shipping-calendar').length > 0 ? 'shipping' : 'receiving';
        var user = null;
        if (status == 'shipping') {
          user = $scope.shippingUser;
        } else {
          user = $scope.receivingUser;
        }

        if (!user) {
          alert('Select carrier first.');
          return;
        }
        data = {
          start: date,
          interval: shipmentsInterval,
          status: status,
          user: user,
          admin: true
        };
        $state.go('application.adminSide.shipments.newShipment');
      } else {
        data = {start: date,
                interval: shipmentsInterval,
                status: $scope.carrierActiveShipment};
        $state.go('application.shipments.newShipment');
      }
      //broadcast status on
      setTimeout(function () {
        $rootScope.$emit("shipment:create", data);
      }, 100);
    };

    $scope.editShipment = function (data, jsEvent, view) {
      if (data.stub)
        return;
      if (admin) {
        data.admin = true;
        data.status = data.color === "#FF8C00" ? 'shipping' : 'receiving';
        $state.go('application.adminSide.shipments.editShipment');
      }
      else {
        $state.go('application.shipments.editShipment');
      }

      setTimeout(function () {
        $rootScope.$emit("shipment:edit", data);
      }, 100);
    };

    $scope.addShipmentToCalendar = function (e, data) {
      // type: ShippingVSReceiving
      var calendar = getCalendar(data.shipment.status);
      var events = getActiveShipments(data.shipment.status);
      // Algorithm works next:
      // firstly remove all sources from fullcalendar,
      // than add event to source, and then add that source again
      calendar.fullCalendar( 'removeEventSource',  events);
      events.push(data.shipment);
      calendar.fullCalendar('addEventSource', events);
    };

    $scope.updateEvent = function (e, data) {
      var calendar = getCalendar(data.status);
      var events = calendar.fullCalendar('clientEvents');
      var sourceEvents = getActiveShipments(data.status);
      angular.forEach(events, function(e, i) {
        if (e.sid === data.sid ) {
          e.title = data.po + ' - ' + data.company;
          calendar.fullCalendar('updateEvent', e);
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
      var calendar = getCalendar(data.status);
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

    function getCalendar(type) {
      if (type) {
        if (type === 'shipping') {
          return uiCalendarConfig.calendars.shippingCal;
        } else {
          return uiCalendarConfig.calendars.receivingCal;
        }
      } else {
        return uiCalendarConfig.calendars.myCalendar;
      }
    }
    // When user is resolved
    session.authPromise.then(function (user) {
      init(session.getCurrentUser());
    });
  }]);