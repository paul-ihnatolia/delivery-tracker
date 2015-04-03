  (function () {
  "use strict";
  angular.module('dtracker')
    .controller('NewShipmentCtrl', ['$scope', '$rootScope','Shipment', 'CheckShipment', '$state',
      function ($scope, $rootScope, Shipment, CheckShipment, $state) {
      var formShipment = this;
      formShipment.shipment = {
        po: '',
        company: '',
        startDate: '',
        endDate: '',
        category: ''
      };
      formShipment.message = null;
      formShipment.formTitle = "Create Shipment";
      formShipment.action = 'create';

      formShipment.isAdmin = false;

      formShipment.avaliableCategories = ["shipping", "receiving"];

      formShipment.process = function () {
        var s = formShipment.shipment;

        //Data which will be send to server
        var shipmentServerData = {
          start_date: moment(s.startDate.toISOString()).format("YYYY-MM-DD HH:mm"),
          end_date: moment(s.startDate.toISOString()).add(s.timeElapsed, 'minutes').format("YYYY-MM-DD HH:mm"),
          po: s.po,
          category: s.category,
          company: s.company
        };
        if (formShipment.isAdmin) {
          shipmentServerData.user = s.user;
        }
        
        var category = formShipment.isAdmin ? s.category : null;
        if (CheckShipment.isOverlapping(shipmentServerData, category)) {
          alert('New shipment is overlapping existing!');
        } else {
          // Call to the server
          formShipment.message = null;
          var shipment = new Shipment({shipment: shipmentServerData});
          shipment.$save(
            function (data) {
              var shipmentCal = {};
              shipmentCal.allDay = false;
              shipmentCal.title = shipmentServerData.po + ' - ' + shipmentServerData.company;
              shipmentCal.start = shipmentServerData.start_date;
              shipmentCal.end = shipmentServerData.end_date;
              shipmentCal.color = data.shipment.category === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
              shipmentCal.sid = data.shipment.id;
              shipmentCal.editable = true;
              if (formShipment.isAdmin) {
                shipmentCal.user = shipmentServerData.user;
                shipmentCal.category = shipmentServerData.category;
              }
              $rootScope.$emit('addShipmentToCalendar', {shipment: shipmentCal});
              formShipment.shipment = {
                po: '',
                company: '',
                startDate: '',
                endDate: '',
                timeElapsed: ''
              };
              formShipment.message = {
                content: 'Shipment was saved.',
                type: 'success'
              };
              if(formShipment.isAdmin) {
                $('#myModal').modal('hide');
              }
            },
            function (error) {
              alert("Some errors happened!");
            }
          );
        }
      };

      formShipment.showForm = function (e, data) {
        //else if not admin?
        formShipment.shipment = {
          po: '',
          company: '',
          startDate: data.start,
          endDate: '',
          timeElapsed: data.interval,
          category: data.category,
          user: data.user
        };
        formShipment.message = null;
        $scope.$apply();
        //if data admin - show modal window with standart new-shipment template.
        
        formShipment.showDeleteButton = false;
        //set if user is admin
        if(data.admin) {
          formShipment.isAdmin = true;
          $('#myModal').modal('show');
        }
      };

      var createHandle = $rootScope.$on('shipment:create', formShipment.showForm);
      $scope.$on('$destroy', createHandle);

      $scope.getDate = function() {
        return moment(formShipment.shipment.startDate).format("YYYY-MM-DD, hh:mm A")
      };
    }]);
}());