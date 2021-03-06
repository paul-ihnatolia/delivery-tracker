(function () {
    "use strict";
    var dtracker = angular.module('dtracker', [
        'ui.router',
        'templates',
        'ipCookie',
        'ng-token-auth',
        'ngResource',
        'ui.calendar',
        'ui.bootstrap.datetimepicker',
        'ngTable',
        'ngTableExport',
        'angularSpinner',
        'ui.bootstrap',
        'daterangepicker',
        'flash'
    ]);
    dtracker.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/auth/sign_in');
        $stateProvider
        .state('application', {
            url: '/',
            //controller: 'ApplicationCtrl',
            abstract: true,
            template: '<ui-view/>'
        })
        .state('application.shipments', {
            url: '^/shipments',
            views: {
                '': {templateUrl: 'application/shipments/templates/shipments-container.html'},
                'shipments@application.shipments': {
                    controller: 'CalendarCtrl as cal',
                    templateUrl: 'application/shipments/templates/shipment.html'
                },
                'newShipment@application.shipments': {
                    controller: 'NewShipmentCtrl as newShipment',
                    templateUrl: 'application/shipments/templates/new-shipment.html'
                }
            }
        }).state('application.adminSide', {
            url: '^/admin',
            templateUrl: 'application/shipments/templates/admin/admin-container.html',
            abstract: true
        })
        .state('application.adminSide.calendar_settings', {
            url: '^/calendar-settings',
            templateUrl: 'application/calendar/calendar_settings.html',
            controller: 'CalendarSettingsCtrl as cs'
        })
        .state('application.adminSide.shipments', {
            url: '/shipments',
            controller: 'CalendarCtrl as cal',
            templateUrl: 'application/shipments/templates/admin/admin-shipments-container.html'
        })
        .state('application.adminSide.shipments.newShipment', {
            url: '/new',
            controller: "NewShipmentCtrl as formShipment",
            templateUrl: 'application/shipments/templates/admin/admin-form-shipment.html'
        })
        .state('application.adminSide.shipments.editShipment', {
            url: '/edit',
            controller: "EditShipmentCtrl as formShipment",
            templateUrl: 'application/shipments/templates/admin/admin-form-shipment.html'
        })
        .state('application.shipments.newShipment', {
            url: '/new',
            controller: 'NewShipmentCtrl as newShipment',
            templateUrl: 'application/shipments/templates/new-shipment.html'
        }).state('application.shipments.editShipment', {
            url: '/edit',
            controller: 'EditShipmentCtrl as editShipment',
            templateUrl: 'application/shipments/templates/edit.html'
        })
        .state('application.auth', {
            url: '^/auth',
            templateUrl: 'application/auth/templates/container.html',
            controller: function ($scope) {}
            //abstract: true
        }).state('application.auth.sign_up', {
            url: '/sign_up',
            controller: 'RegistrationCtrl as reg',
            templateUrl: 'application/auth/templates/sign-up-form.html'
        }).state('application.auth.sign_in', {
            url: '/sign_in',
            controller: 'SessionCtrl as session',
            templateUrl: 'application/auth/templates/sign-in-form.html'
        }).state('application.auth.logout', {
            url: '/logout',
            controller: 'LogoutCtrl'
        }).state('application.auth.forgot_pass', {
            url: '/forgot_pass',
            controller: 'ForgotPassCtrl as forgot',
            templateUrl: 'application/auth/templates/forgot-pass-form.html'
        }).state('application.auth.new_pass', {
            url: '/new-pass',
            controller: 'RestorePassCtrl as passRestore',
            templateUrl: 'application/auth/templates/restore-pass-form.html'
        }).state('application.adminSide.statistics', {
            url: "/statistics",
            templateUrl : 'application/shipments/templates/shipment_table.html',
            controller  : 'ShipmentDataCtrl as statistics'
        });
    }]).config(['$httpProvider',function($httpProvider) {
        //Http Intercpetor to check auth failures for xhr requests
        $httpProvider.interceptors.push('authHttpResponseInterceptor');
    }]);

    dtracker.run(['Session', '$auth', 'UserDecorator', '$location',
        function (session, $auth, UserDecorator, $location) {
        session.authPromise = $auth.validateUser().then(function (user) {
            console.log("authPromise");
            session.create(user);
            return new UserDecorator(user);
        }, function (q, w, e, r) {
            session.destroy();
            $location.path('/auth/sign_in');
            return null;
        });
    }]);
}());