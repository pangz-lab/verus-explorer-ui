'use strict';

angular
.module('insight.system')
.controller('HeaderController',
    function (
        $scope,
        $rootScope,
        $modal,
        // Global,
        $location
    ) {
        //$scope.global = Global;
        
        $rootScope.currency = {
            factor: 1,
            bitstamp: 0,
            testnet: testnet,
            netSymbol: netSymbol,
            symbol: netSymbol
        };

        $scope.menu = [{
            'title': 'Blocks',
            'link': 'blocks'
        }, {
            'title': 'Charts',
            'link': 'charts'
        }, {
            'title': 'Status',
            'link': 'status'
        }, {
            'title': 'Help',
            'link': 'help'
        }];

        $scope.openScannerModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'scannerModal.html',
                controller: 'ScannerController'
            });
        };

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $rootScope.isCollapsed = true;
    });
