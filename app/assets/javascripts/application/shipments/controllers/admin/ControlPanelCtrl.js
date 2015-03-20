(function(){
    angular.module('dtracker')
        .controller('ControlPanelCtrl', function(){

            this.activeClassAdmin = function() {
                if($('#shipments').hasClass('active')) {
                    $('#carriers').addClass('active');
                    $('#shipments').removeClass('active');
                } else if($('#carriers').hasClass('active')) {
                    $('#shipments').addClass('active');
                    $('#carriers').removeClass('active');
                }
            };
        });
}());