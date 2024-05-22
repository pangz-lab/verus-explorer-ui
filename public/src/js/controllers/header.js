'use strict';

angular
.module('insight.system')
.controller('HeaderController',
    function (
        $scope,
        $rootScope,
        $modal,
        // Global,
        $location,
        LocalStore
    ) {
        //$scope.global = Global;
        const CACHE_THEME_COLOR = 1;
        const CACHE_TTL_THEME_COLOR = 1400;
        
        const _reloadPage = function() {
            $location.url($location.url());
        }
        $rootScope.currency = {
            factor: 1,
            bitstamp: 0,
            testnet: testnet,
            netSymbol: netSymbol,
            symbol: netSymbol
        };

        const themeColor = LocalStore.get(CACHE_THEME_COLOR);
        const defaultTheme = 0;
        $rootScope.themeColor = (themeColor == undefined)? defaultTheme : themeColor;

        $scope.toggleTheme = function() {
            $rootScope.themeColor = $rootScope.themeColor == 1? 0 : 1;
            LocalStore.set(CACHE_THEME_COLOR, $rootScope.themeColor, CACHE_TTL_THEME_COLOR)
            _reloadPage();
        }

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
