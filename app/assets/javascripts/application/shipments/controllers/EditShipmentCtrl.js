(function () {
  'use strict';
  angular.module('dtracker')
  .controller('EditShipmentCtrl', ['$rootScope', '$scope', 'Shipment', '$http',
    function ($rootScope, $scope, shipment, $http) {

    var editShipment = this;

    editShipment.shipment = {};
    editShipment.message = null;

    editShipment.showShipment = function (event, shipmentData) {
      // Export data from controller
      var shipment = {};
      var companyPo = shipmentData.title.split(/\s-\s/);
      editShipment.message = null;
      
      shipment.po = companyPo[0];
      shipment.company = companyPo[1];
      shipment.sid = shipmentData.sid;
      
      editShipment.shipment = shipment;
      $scope.$apply();
    };

    $rootScope.$on('shipment:edit', editShipment.showShipment);

    editShipment.updateShipment = function () {
      editShipment.message = null;
      $http.put('/api/shipments/' + editShipment.shipment.sid,
        { shipment: { po: editShipment.shipment.po,
                      company: editShipment.shipment.company} })
        .success(function(data, status, headers, config) {
          $rootScope.$emit('shipment:updateEvent', editShipment.shipment);
          editShipment.message = {
            type: 'success',
            content: 'Shipment was updated.'
          };
        })
        .error(function(data, status, headers, config) {
          $scope.errors = data.errors;
        });
    };
  }]);
}());