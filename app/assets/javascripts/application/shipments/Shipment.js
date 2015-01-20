/**
 * Created by paul on 1/16/15.
 */

var dtracker = angular.module('dtracker');

dtracker.factory('Shipment', ['$resource', function ($resource) {
    return $resource('/api/shipments/:id', { id: '@id' }, { update: { method: 'PUT' }});
}]);