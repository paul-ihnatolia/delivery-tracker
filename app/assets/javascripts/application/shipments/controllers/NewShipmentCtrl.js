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
        status: ''
      };
      formShipment.message = null;
      formShipment.formTitle = "Create Shipment";
      formShipment.action = 'create';

      formShipment.isAdmin = false;

      formShipment.avaliableStatuses = ["shipping", "receiving"];

      formShipment.process = function () {
        var s = formShipment.shipment;
        
        //Data which will be send to server
        var shipmentServerData = {
          start_date: moment(s.startDate).format("YYYY-MM-DD HH:mm:ss z"),
          end_date: moment(s.startDate).add(s.timeElapsed, 'minutes').format("YYYY-MM-DD HH:mm:ss z"),
          po: s.po,
          status: s.status,
          company: s.company
        };
        
        if (formShipment.isAdmin) {
          shipmentServerData.user = s.user;
        }
        
        if (CheckShipment.isOverlapping(shipmentServerData, s.status)) {
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
              shipmentCal.color = data.shipment.status === "shipping" ? "#FF8C00" : "rgb(138, 192, 7)";
              shipmentCal.sid = data.shipment.id;
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
          status: data.status,
          user: data.user
        };
        formShipment.message = null;
        $scope.$apply();
        //if data admin - show modal window with standart new-shipment template.
        
        //set if user is admin
        if(data.admin) {
          formShipment.isAdmin = true;
          $('#myModal').modal('show');
        }
      };

      $rootScope.$on('shipment:create', formShipment.showForm);
    }]);
}());