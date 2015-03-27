(function () {
  'use strict';
  angular.module('dtracker')
  .controller('EditShipmentCtrl', ['$rootScope', '$scope', 'Shipment', '$http',
    function ($rootScope, $scope, shipment, $http) {

    var formShipment = this;

    formShipment.shipment = {};
    formShipment.formTitle = "Edit Shipment";
    formShipment.action = 'edit';
    formShipment.isAdmin = false;

    formShipment.avaliableCategories = ["shipping", "receiving"];

    formShipment.message = null;

    formShipment.showShipment = function (event, shipmentData) {
      // Export data from controller
      var shipment = {};
      var companyPo = shipmentData.title.split(/\s-\s/);
      formShipment.message = null;
      formShipment.showDeleteButton = true;
      
      //set admin
      if(shipmentData.admin) {
        formShipment.isAdmin = true;
      }

      formShipment.shipment = {
        po        : companyPo[0],
        company   : companyPo[1],
        sid       : shipmentData.sid,
        _id       : shipmentData._id,
        startDate : shipmentData.start,
        endDate   : shipmentData.end,
        category    : shipmentData.category,
        user      : shipmentData.user
      };

    //  formShipment.shipment = shipment;
      $scope.$apply();
      if (formShipment.isAdmin) {
        $('#myModal').modal('show');
      }
    };

    var editHandle = $rootScope.$on('shipment:edit', formShipment.showShipment);
    $scope.$on('$destroy', editHandle);

    formShipment.process = function () {
      formShipment.message = null;
      
      if(formShipment.isAdmin){
        var update = $http.put('/api/shipments/' + formShipment.shipment.sid,
            { shipment: { po: formShipment.shipment.po,
                          company: formShipment.shipment.company} });
      }
      else{
        var update = $http.put('/api/shipments/' + formShipment.shipment.sid,
            { shipment: formShipment.shipment });
      }


      update.success(function(data, category, headers, config) {
        $rootScope.$emit('shipment:updateEvent', formShipment.shipment);
        formShipment.message = {
          type: 'success',
          content: 'Shipment was updated.'
        };
        if (formShipment.isAdmin) {
          $('#myModal').modal('hide');
        }
      })
      .error(function(data, category, headers, config) {
        $scope.errors = data.errors;
      });
    };

    formShipment.deleteShipment = function (event) {
      var shipmentId = formShipment.shipment.sid;
      if (shipmentId && confirm('Are you sure?')) {
        $http.delete('/api/shipments/' + shipmentId)
        .success(function (data, category) {
          $rootScope.$emit('shipment:deleteEvent', {sid: formShipment.shipment.sid,
                                                    _id: formShipment.shipment._id,
                                                    category: formShipment.shipment.category});
          formShipment.message = {
            type: 'success',
            content: 'Shipment was deleted.'
          };
          if (formShipment.isAdmin) {
            $('#myModal').modal('hide');
            location.reload();
          }
        }).error(function(data, category){
          $scope.errors = data.errors;
        });
      }
    };

    $scope.getDate = function() {
        return moment(formShipment.shipment.startDate).format("YYYY-MM-DD, hh:mm A")
    };
  }]);
}());