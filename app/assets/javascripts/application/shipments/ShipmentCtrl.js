/**
 * Created by paul on 1/16/15.
 */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$http', '$scope','Shipment', '$timeout', '$rootScope', "uiCalendarConfig", function ($http, $scope, Shipment, $timeout, $rootScope, uiCalendarConfig) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  // Clear events and assign the events source.
  $scope.events = [];
  
//  console.log(shipment.query());
//  
  // $scope.events = [
  //   {title: 'All Day Event',start: new Date(y, m, 1)},
  //   {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
  //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
  //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
  //   {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
  //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
  // ];

  Shipment.query().$promise.then(function(data) {
      angular.forEach(data, function (r) {
        $scope.events.push({
          id: r._id,
          start: r.start_date,
          end: r.end_date,
          title: r.po + ' - ' + r.company
        });
      });
  });

  /* Render calendar */
  $scope.changeView = function (view) {
    uiCalendarConfig.calendars.myCalendar.fullCalendar('changeView',view);
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


  //OVERLAPPING CHECK
  //http://stackoverflow.com/questions/2369683/is-there-a-way-to-prevent-overlapping-events-in-jquery-fullcalendar
  // function isOverlapping(event){
  //   var array = uiCalendarConfig.calendars.myCalendar.fullCalendar('clientEvents');
  //   for(var i = 0; i < array.length; i++) {
  //     if(array[i]._id != event.id){
  //       if (moment.utc(array[i].start) <= moment.utc(event.start) && moment.utc(array[i].end) > moment.utc(event.start)) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

//Scheduler
  $scope.schedulerOpened = false;

  $scope.createShipment = function(date){
    $rootScope.$emit("showShipmentForm", {start: date});
    // $scope.schedulerOpened = true;
    // $scope.shipment = {};
    //     $scope.shipment.start = date;
  };

  $scope.editShipment = function(shipment){
    $scope.schedulerOpened = true;
    $scope.shipment = shipment;
  };


  var tevents = [{"start":"2015-01-18 17:46:40 UTC","end":"2015-01-13 17:46:40 UTC"},{"start":"2015-01-18 17:46:40 UTC","end":"2015-01-09 17:46:40 UTC"},{"start":"2015-01-17 17:46:40 UTC","end":"2015-01-13 17:46:40 UTC"},{"start":"2015-01-16 17:46:40 UTC","end":"2015-01-16 17:46:40 UTC"},{"start":"2015-01-10 17:46:40 UTC","end":"2015-01-15 17:46:40 UTC"},{"start":"2015-01-13 17:46:40 UTC","end":"2015-01-13 17:46:40 UTC"},{"start":"2015-01-14 17:46:40 UTC","end":"2015-01-15 17:46:40 UTC"},{"start":"2015-01-10 17:46:40 UTC","end":"2015-01-12 17:46:40 UTC"},{"start":"2015-01-16 17:46:40 UTC","end":"2015-01-16 17:46:40 UTC"},{"start":"2015-01-14 17:46:40 UTC","end":"2015-01-16 17:46:40 UTC"},{"start":"2015-01-28 22:00:00 UTC","end":"2015-01-28 22:00:00 UTC"},{"start":"2015-01-13 12:51:31 UTC","end":"2015-01-18 12:51:31 UTC"},{"start":"2015-01-19 12:51:31 UTC","end":"2015-01-20 12:51:31 UTC"},{"start":"2015-01-15 12:51:31 UTC","end":"2015-01-21 12:51:31 UTC"},{"start":"2015-01-18 12:51:31 UTC","end":"2015-01-21 12:51:31 UTC"},{"start":"2015-01-12 12:51:31 UTC","end":"2015-01-13 12:51:31 UTC"},{"start":"2015-01-15 12:51:31 UTC","end":"2015-01-13 12:51:31 UTC"},{"start":"2015-01-17 12:51:31 UTC","end":"2015-01-21 12:51:31 UTC"},{"start":"2015-01-12 12:51:31 UTC","end":"2015-01-12 12:51:31 UTC"},{"start":"2015-01-15 12:51:31 UTC","end":"2015-01-16 12:51:31 UTC"},{"start":"2015-01-21 12:51:31 UTC","end":"2015-01-18 12:51:31 UTC"},{"start":"2015-01-17 13:03:01 UTC","end":"2015-01-21 13:03:01 UTC"},{"start":"2015-01-15 13:03:01 UTC","end":"2015-01-15 13:03:01 UTC"},{"start":"2015-01-16 13:03:01 UTC","end":"2015-01-15 13:03:01 UTC"},{"start":"2015-01-15 13:03:01 UTC","end":"2015-01-19 13:03:01 UTC"},{"start":"2015-01-21 13:03:01 UTC","end":"2015-01-21 13:03:01 UTC"},{"start":"2015-01-15 13:03:01 UTC","end":"2015-01-17 13:03:01 UTC"},{"start":"2015-01-21 13:03:01 UTC","end":"2015-01-18 13:03:01 UTC"},{"start":"2015-01-21 13:03:01 UTC","end":"2015-01-21 13:03:01 UTC"},{"start":"2015-01-20 13:03:01 UTC","end":"2015-01-14 13:03:01 UTC"},{"start":"2015-01-13 13:03:01 UTC","end":"2015-01-19 13:03:01 UTC"},{"start":"2015-01-21 13:15:48 UTC","end":"2015-01-18 13:15:48 UTC"},{"start":"2015-01-21 13:15:48 UTC","end":"2015-01-18 13:15:48 UTC"},{"start":"2015-01-18 13:15:48 UTC","end":"2015-01-17 13:15:48 UTC"},{"start":"2015-01-20 13:15:48 UTC","end":"2015-01-12 13:15:48 UTC"},{"start":"2015-01-13 13:15:48 UTC","end":"2015-01-13 13:15:48 UTC"},{"start":"2015-01-19 13:15:48 UTC","end":"2015-01-13 13:15:48 UTC"},{"start":"2015-01-13 13:15:48 UTC","end":"2015-01-18 13:15:48 UTC"},{"start":"2015-01-20 13:15:48 UTC","end":"2015-01-20 13:15:48 UTC"},{"start":"2015-01-15 13:15:48 UTC","end":"2015-01-15 13:15:48 UTC"},{"start":"2015-01-19 13:15:48 UTC","end":"2015-01-17 13:15:48 UTC"}];

  $scope.addShipment = function(newShipment){
    //Date manipulations
    //newSipment.eventDateTime = new Date(newSipment.date.getFullYear(), newSipment.date.getMonth(), newSipment.date.getDay(), newSipment.time.getHours(), newSipment.time.getMinutes(), 0 , 0);
    
    newShipment.title = newShipment.poNumber + " - " + newShipment.company;
    newShipment.end = moment(newShipment.start).add(newShipment.timeElapsed, 'minutes')._d;
    newShipment.allDay = false;

    console.log(newShipment);
    events.push(newShipment);
    $scope.shipment = {};
  };

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
      editable: true,
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

  $scope.eventSources =  [$scope.events];
}]);