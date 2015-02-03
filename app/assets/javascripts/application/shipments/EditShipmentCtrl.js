(function () {
  "use strict";
  angular.module('dtracker')
    .controller('EditShipmentCtrl', ['$scope', '$http', '$rootScope','Shipment', 'CheckShipment', 'userRoles', function ($scope, $http, $rootScope, Shipment, CheckShipment, userRoles) {
      var editShipment = this;
      editShipment.shipment = {};

      editShipment.statuses = ["shipping", "receiving"];

      editShipment.canEdit = !userRoles.hasRole("admin");    

      editShipment.updateShipment = function(){
        if(editShipment.canEdit){

          $http.put('/api/shipments/' + editShipment.shipment.id , {shipment: {status: editShipment.shipment.status}}).
            success(function(data, status, headers, config) {
                console.log("Returned data after update");
                console.log(data);
                $rootScope.$emit('updateEventSuccessful', editShipment.shipment);

            }).
            error(function(data, status, headers, config) {
                console.log("Error after update");
                console.log(error);
            });
        }
        else{
          $http.put('/api/shipments/' + editShipment.shipment.id , {shipment: {
                                                                    po      : editShipment.shipment.po,
                                                                    status  : editShipment.shipment.status,
                                                                    company : editShipment.shipment.company,
                                                                    start   : editShipment.shipment.start,
                                                                    end     : editShipment.shipment.end
                                                                  }}).
            success(function(data, status, headers, config) {
                console.log("Returned data after update");
                console.log(data);
                $rootScope.$emit('updateEventSuccessful', editShipment.shipment);
            }).
            error(function(data, status, headers, config) {
                console.log("Error after update");
                console.log(error);
            });
        }
      };  
      
      $rootScope.$on('sendShipmentToEditController', function(event, data){
        console.log("RECEIVED: ");
        console.log(data);
        editShipment.shipment = data;
      });
    }]);
}());