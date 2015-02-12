(function () {
  'use strict';
  angular.module('dtracker')
  .controller('EditShipmentCtrl', ['$rootScope', '$scope', 'Shipment', '$http',
    function ($rootScope, $scope, shipment, $http) {

    var formShipment = this;

    formShipment.shipment = {};
    formShipment.formTitle = "Edit Shipment";
    formShipment.action = 'edit';

    formShipment.avaliableStatuses = ["shipping", "receiving"];

    formShipment.message = null;

    formShipment.showShipment = function (event, shipmentData) {
      // Export data from controller
      var shipment = {};
      var companyPo = shipmentData.title.split(/\s-\s/);
      formShipment.message = null;
      
      //console.log(shipmentData);
      // shipment.po = companyPo[0];
      // shipment.company = companyPo[1];
      // shipment.sid = shipmentData.sid;
      // shipment._id = shipmentData._id;
      // shipment.startDate = shipmentData.start;
      // shipment.endDate = shipmentData.end;

      formShipment.shipment = {
        po        : companyPo[0],
        company   : companyPo[1],
        sid       : shipmentData.sid,
        _id       : shipmentData._id,
        startDate : shipmentData.start,
        endDate   : shipmentData.end,
        status    : shipmentData.status
      };

    //  formShipment.shipment = shipment;
      $scope.$apply();
    };

    $rootScope.$on('shipment:edit', formShipment.showShipment);

    formShipment.process = function () {
      formShipment.message = null;
      $http.put('/api/shipments/' + formShipment.shipment.sid,
        { shipment: { po: formShipment.shipment.po,
                      company: formShipment.shipment.company} })
        .success(function(data, status, headers, config) {
          $rootScope.$emit('shipment:updateEvent', formShipment.shipment);
          formShipment.message = {
            type: 'success',
            content: 'Shipment was updated.'
          };
        })
        .error(function(data, status, headers, config) {
          $scope.errors = data.errors;
        });
    };

    formShipment.deleteShipment = function (event) {
      var shipmentId = formShipment.shipment.sid;
      if (shipmentId && confirm('Are you sure?')) {
        $http.delete('/api/shipments/' + shipmentId)
        .success(function (data, status) {
          $rootScope.$emit('shipment:deleteEvent', {sid: formShipment.shipment.sid,
                                                    _id: formShipment.shipment._id});
          formShipment.message = {
            type: 'success',
            content: 'Shipment was deleted.'
          };
        }).error(function(data, status){
          $scope.errors = data.errors;
        });
      }
    };
  }]);
}());