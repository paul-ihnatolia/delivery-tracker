/**
 * Created by paul on 1/16/15.
 */

var dtracker = angular.module('dtracker');

dtracker.controller('ShipmentCtrl', ['$scope', 'Shipment', function ($scope, shipment) {
  this.shipments = shipment.query();
}]);