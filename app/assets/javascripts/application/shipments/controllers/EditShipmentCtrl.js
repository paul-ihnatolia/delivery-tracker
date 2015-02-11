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
      shipment._id = shipmentData._id;

      editShipment.shipment = shipment;
      $scope.$apply();
    };

    var editHandle = $rootScope.$on('shipment:edit', editShipment.showShipment);
    $scope.$on('$destroy', editHandle);

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

    editShipment.deleteShipment = function (event) {
      var shipmentId = editShipment.shipment.sid;
      if (shipmentId && confirm('Are you sure?')) {
        $http.delete('/api/shipments/' + shipmentId)
        .success(function (data, status) {
          $rootScope.$emit('shipment:deleteEvent', {sid: editShipment.shipment.sid,
                                                    _id: editShipment.shipment._id});
          editShipment.message = {
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