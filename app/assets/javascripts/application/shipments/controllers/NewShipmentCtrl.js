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
        var shipmentCal = {};
        var s = formShipment.shipment;

        shipmentCal.start = s.startDate;
        shipmentCal.title = s.po +
        ' - ' + s.company;
        shipmentCal.start = moment(s.startDate).format("YYYY-MM-DD HH:mm:ss z");
        
        //if is admin
        if (formShipment.isAdmin){
          shipmentCal.end = s.endDate;
          shipmentCal.status = s.status;
          shipmentCal.admin = formShipment.isAdmin;
        }
        else
          shipmentCal.end = moment(s.startDate).add(s.timeElapsed, 'minutes').format("YYYY-MM-DD HH:mm:ss z");
        
        shipmentCal.allDay = false;
        // Contact to service
        if (CheckShipment.isOverlapping(shipmentCal)) {
          alert('New shipment is overlapping existing!');
        } else {
          // Call to the server
          formShipment.message = null;
          var shipment = new Shipment({shipment: {start_date: shipmentCal.start,
                                                  end_date: shipmentCal.end,
                                                  po: s.po,
                                                  company: s.company,
                                                  status: s.status}});
          shipment.$save(
            function (data) {
              console.log(data);
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
        //if data admin - show modal window with standart new-shipment template.
        
        //set if user is admin
        if(data.admin)
          formShipment.isAdmin = true;

        //else if not admin?
        formShipment.shipment = {
          po: '',
          company: '',
          startDate: data.start,
          endDate: '',
          timeElapsed: data.interval,
          status: data.status
        };
        formShipment.message = null;
        $scope.$apply();
      };

      $rootScope.$on('shipment:create', formShipment.showForm);
    }]);
}());