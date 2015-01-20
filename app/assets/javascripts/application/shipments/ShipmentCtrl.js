/**
 * Created by paul on 1/16/15.
 */

var dtracker = angular.module('dtracker');

dtracker.controller('CalendarCtrl', ['$scope', function ($scope) {

  $scope.callCal = function(){
      console.log($scope.myCalendar.fullCalendar('clientEvents'));
  }

  $scope.timePredefined = [
    { label: '15m', value: 15 },
    { label: '20m', value: 20 },
    { label: '30m', value: 30 },
    { label: '40m', value: 40 },
    { label: '50m', value: 50 },
    { label: '1h', value: 60 }
  ];


  $scope.eventSources = [events];
	
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
  } 


	$scope.uiConfig = {
      calendar:{
        editable: true,
        allDaySlot: false,
        defaultView: 'agendaDay',
        slotEventOverlap: false,
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
  		eventClick: $scope.eventClick,
          dayClick: $scope.dayClick,
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
      },
    };

//OVERLAPPING CHECK
//http://stackoverflow.com/questions/2369683/is-there-a-way-to-prevent-overlapping-events-in-jquery-fullcalendar
// function isOverlapping(event){
//     var array = calendar.fullCalendar('clientEvents');
//     for(i in array){
//         if(array[i].id != event.id){
//             if(!(array[i].start >= event.end || array[i].end <= event.start)){
//                 return true;
//             }
//         }
//     }
//     return false;
// }




//Scheduler
  $scope.schedulerOpened = false;

  $scope.createShipment = function(date){
    $scope.schedulerOpened = true;
    $scope.shipment = {};
        $scope.shipment.start = date;
  }

  $scope.editShipment = function(shipment){
    $scope.schedulerOpened = true;
    $scope.shipment = shipment;
  }



  $scope.addShipment = function(newShipment){
    //Date manipulations
    //newSipment.eventDateTime = new Date(newSipment.date.getFullYear(), newSipment.date.getMonth(), newSipment.date.getDay(), newSipment.time.getHours(), newSipment.time.getMinutes(), 0 , 0);
    
    newShipment.title = newShipment.poNumber + " - " + newShipment.company;
    newShipment.end = moment(newShipment.start).add(newShipment.timeElapsed, 'minutes')._d;
    newShipment.allDay = false;

    console.log(newShipment);
    events.push(newShipment);
    $scope.shipment = {};
  }

}]);

var events = [
        {
            title: 'Event1',
            start: '2015-01-19'
        },
        {
            title: 'Event2',
            start: 'Mon Jan 19 2015 16:00:00 GMT+0200 (EET)',
            end: 'Mon Jan 20 2015 16:00:00 GMT+0200 (EET)'
        }
    ];