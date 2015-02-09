/**
 * Created by paul on 1/16/15.
 */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", 'userRoles',
  function ($http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig, userRoles) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  // Clear events and assign the events source.
  $scope.events = [];
  
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

  /* Render calendar */
  $scope.changeView = function (calendarName, view) {
    uiCalendarConfig.calendars[calendarName].fullCalendar('changeView',view);
  };

  $scope.UpdateCal = function () {
    console.log($scope.events);
    console.log('Clearing $scope.events via splice(0)');
    $scope.events.splice(0);
    

    $timeout(function () {

      angular.forEach(events2, function (event) {
        $scope.events.push(event);
      });
      console.log('New Events pushed');

    }, 100);
  };

  $scope.CallFromUrl = function () {
    Shipment.query().$promise.then(function(data) {
        angular.forEach(data, function (event) {
          $scope.events.push(event);
        });
    });
  };

  $scope.eventRender = function( event, element, view ) { 
      element.attr({'tooltip': event.title,
                   'tooltip-append-to-body': true});
      $compile(element)($scope);
  };
  
  $scope.eventClick = function(event){
    $scope.editShipment(event);
    //alert("event is clicked");
    //get this event and edit it
  };

  $scope.dayClick = function(date){
    //alert(date);
    $scope.createShipment(date);
    //get all the events for this day and place them to the list
  };

  $scope.removeShipment = function(index){
    events.splice(index,1);
  };

  //Scheduler
  $scope.schedulerOpened = false;

  $scope.createShipment = function(date){
    $rootScope.$emit("showShipmentForm", {start: date});
  };

  $scope.editShipment = function(shipment){
    $scope.schedulerOpened = true;
    $scope.shipment = shipment;
  };

  // $scope.addShipment = function(newShipment){
  //   //Date manipulations
  //   //newSipment.eventDateTime = new Date(newSipment.date.getFullYear(), newSipment.date.getMonth(), newSipment.date.getDay(), newSipment.time.getHours(), newSipment.time.getMinutes(), 0 , 0);
  //   debugger;
  //   newShipment.color = newShipment.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
  //   newShipment.title = newShipment.poNumber + " - " + newShipment.company;
  //   newShipment.end = moment(newShipment.start).add(newShipment.timeElapsed, 'minutes')._d;
  //   newShipment.allDay = false;

  //   events.push(newShipment);
  // };

  // Normal code
  $scope.addShipmentToCalendar = function (e, data) {
    console.log("addShipmentToCalendar");
    console.log(data.shipment);
    $scope.events.push(data.shipment);
  };

  $rootScope.$on('addShipmentToCalendar', $scope.addShipmentToCalendar);

  // Calendar config
  $scope.uiConfig = {
    calendar:{
      editable: userRoles.hasRole('admin') ? true : false,
      allDaySlot: false,
      defaultView: 'agendaDay',
      slotEventOverlap: false,
      minTime: "08:00:00",
      maxTime: "23:00:00",
      slotDuration: '00:05:00',
      header:{
        left: '',
        center: 'title',
        right: 'today prev,next'
      },
      eventClick: $scope.eventClick,
      // it will passe clicked date into function
      dayClick: $scope.dayClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize
    }
  };
  // Set stick option
  //  uiCalendarConfig.calendars.myCalendar.fullCalendar('renderEvent', {}, true);
  $scope.eventSources =  [$scope.events];
}]);