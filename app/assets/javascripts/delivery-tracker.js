(function () {
    "use strict";
    var dtracker = angular.module('dtracker', [
        'ui.router',
        'templates',
        'ipCookie',
        'ng-token-auth',
        'ngResource',
        'ui.calendar',
        'ui.bootstrap.datetimepicker'
    ]);
    dtracker.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/shipments');
        $stateProvider.state('shipments', {
            url: '/shipments',
            views: {
                '': {templateUrl: 'application/shipments/templates/shipments-container.html'},
                'shipments@shipments': {
                    controller: 'CalendarCtrl as cal',
                    templateUrl: 'application/shipments/templates/shipment.html'
                },
                'newShipment@shipments': {
                    controller: 'NewShipmentCtrl as newShipment',
                    templateUrl: 'application/shipments/templates/new-shipment.html'
                }
            }
        });
    }]);
}());