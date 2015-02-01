(function () {
  "use strict";
  angular.module('dtracker')
    .controller('NewShipmentCtrl', ['$scope', '$rootScope','Shipment', function ($scope, $rootScope, Shipment) {
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
        { label: '15m', value: 15 },
        { label: '20m', value: 20 },
        { label: '30m', value: 30 },
        { label: '40m', value: 40 },
        { label: '50m', value: 50 },
        { label: '1h', value: 60 }
      ];

      newShipment.createNewShipment = function () {
        var shipmentCal = {};
        var s = newShipment.shipment;
        shipmentCal.title = s.po +
        ' - ' + s.company;
        shipmentCal.end = moment(s.startDate).add(s.timeElapsed, 'minutes')._d;
        shipmentCal.allDay = false;
        console.log(shipmentCal);
        $rootScope.$emit('addShipmentToCalendar', {shipment: shipmentCal});
        newShipment.shipment = {
          po: '',
          company: '',
          startDate: '',
          endDate: '',
          timeElapsed: ''
        };
      };

      newShipment.addShipment = function () {

      };
      
      newShipment.showForm = function (e, data) {
        console.log("showForm");
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