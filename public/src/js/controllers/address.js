'use strict';

angular
.module('insight.address')
.controller('AddressController',
    function (
        $scope,
        $rootScope,
        $routeParams,
        VerusExplorerApi,
        ScrollService
    ) {
        $rootScope.scrollToTop = function () {
            ScrollService.scrollToTop();
        };
        $rootScope.scrollToBottom = function () {
            ScrollService.scrollToBottom();
        };

        $scope.params = $routeParams;
        $scope.addressBalance = {
            loading: true
        }

        $scope.findOne = function () {
            const address = $routeParams.addrStr;
            $rootScope.flashMessage = null;
            $rootScope.currentAddr = address;
            $rootScope.titleDetail = address.substring(0, 7) + '...';
            $scope.isIdentityAddress = address.startsWith("i") || address.endsWith("@");
            $scope.address = $routeParams;
            $scope.balance = 0;
            $scope.totalReceived = 0;
            $scope.totalSent = 0;
            $scope.currencyBalances = [];

            $scope.addressBalance.loading = true;
            VerusExplorerApi
            .getAddressBalance(address)
            .then(function (addressBalance) {
                const data = addressBalance.data;
                $scope.addressBalance.loading = false;
               
                const balance = data.balance == undefined ? 0 : data.balance;
                const received = data.received == undefined ? 0 : data.received;
                $scope.balance = ((balance).toFixed(8) / 1e8).toString();
                $scope.totalReceived = ((received).toFixed(8) / 1e8).toString();
                $scope.totalSent = ((received - balance) / 1e8).toString();
                
                if(Object.keys(data.currencybalance).length > 1) {
                    _getCurrencyBalance(data.currencybalance)
                }
            })
            .catch(function (e) {
                $scope.addressBalance.loading = false;
                $rootScope.flashMessage = 'Failed to load the balance summary.';
            });

            if ($scope.isIdentityAddress) {
                VerusExplorerApi
                .getIdentity(address)
                .then(function (addressResult) {
                    const r = addressResult.data;
                    const identityNonRootName = r.friendlyname;
                    const identityRootName = r.identity.name;
                    $scope.primaryAddressIds = r.identity.primaryaddresses;
                    $scope.identityName = (r.identity.parent == r.identity.systemid) ? identityRootName : identityNonRootName;
                });
            }
        };

        var _getCurrencyBalance = function(currencyBalances) {
            const entries = Object.entries(currencyBalances);
            const kIAddress = 0;
            const kCurrency = 1;
            for (var i = 0; i < entries.length; i++) {
                const pair = entries[i];
                VerusExplorerApi
                .getIdentity(pair[kIAddress])
                .then(function (addressResult) {
                    const r = addressResult.data;
                    $scope.currencyBalances.push({
                        currency: r.identity.name,
                        balance: pair[kCurrency],
                    })
                });
            }
        }

    }
);
