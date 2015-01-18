(function () {
    "use strict";
    var dtracker = angular.module('dtracker', [
        'ui.router',
        'templates',
        'ipCookie',
        'ng-token-auth',
        'ngResource'
    ]);
    dtracker.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/shipments');
        $stateProvider.state('shipments', {
            url: '/shipments',
            views: {
                '': {templateUrl: 'application/shipments/templates/shipments-container.html'},
                'shipments@shipments': {
                    controller: 'ShipmentCtrl as sctrl',
                    templateUrl: 'application/shipments/templates/shipment.html'
                },
                'new-shipment@shipments': {
                    controller: 'NewShipmentCtrl as nsctrl',
                    templateUrl: 'application/shipments/templates/shipment_form.html'
                }
            }
        });
    }]);
}());