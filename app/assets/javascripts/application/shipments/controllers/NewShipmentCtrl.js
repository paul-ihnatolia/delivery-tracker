(function () {
  "use strict";
  angular.module('dtracker')
    .controller('NewShipmentCtrl', ['$scope', '$rootScope','Shipment', 'CheckShipment', function ($scope, $rootScope, Shipment, CheckShipment) {
      var newShipment = this;
      newShipment.shipment = {
        po: '',
        company: '',
        startDate: '',
        endDate: '',
        timeElapsed: ''
      };

      newShipment.showShipmentForm = false;

      newShipment.timePredefined = [
        { label: '10m', value: 10 },
        { label: '20m', value: 20 },
        { label: '30m', value: 30 },
        { label: '40m', value: 40 },
        { label: '50m', value: 50 },
        { label: '1h', value: 60 }
      ];

      newShipment.createNewShipment = function () {
        var shipmentCal = {};
        var s = newShipment.shipment;
        shipmentCal.start = s.startDate;
        shipmentCal.title = s.po +
        ' - ' + s.company;
        shipmentCal.start = moment(s.startDate).format("YYYY-MM-DD HH:mm:ss z");
        shipmentCal.end = moment(s.startDate).add(s.timeElapsed.value, 'minutes').format("YYYY-MM-DD HH:mm:ss z");
        shipmentCal.allDay = false;
        // Contact to service
        if (CheckShipment.isOverlapping(shipmentCal)) {
          alert('New shipment is overlapping existing!');
        } else {
          // Call to the server
          var shipment = new Shipment({shipment: {start_date: shipmentCal.start,
                                                  end_date: shipmentCal.end,
                                                  po: s.po,
                                                  company: s.company}});
          shipment.$save(
            function (data) {
              $rootScope.$emit('addShipmentToCalendar', {shipment: shipmentCal});
              newShipment.shipment = {
                po: '',
                company: '',
                startDate: '',
                endDate: '',
                timeElapsed: ''
              };
              newShipment.showShipmentForm = false;
            },
            function (error) {
              alert("Some errors happened!");
            }
          );
        }
      };

      newShipment.addShipment = function () {

      };
      
      newShipment.showForm = function (e, data) {
        newShipment.showShipmentForm = true;
        newShipment.shipment = {
          po: '',
          company: '',
          startDate: data.start,
          endDate: '',
          timeElapsed: ''
        };
      };

      $rootScope.$on('showShipmentForm', newShipment.showForm);
    }]);
}());