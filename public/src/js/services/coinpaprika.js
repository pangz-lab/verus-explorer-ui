'use strict';

angular.module('insight.coinpaprika')
.factory('CoinPaprika',
function (VerusExplorerApi) {
    // function createRequest(endpoint, method) {
    //     const url = 'https://corsproxy.io/?' + encodeURIComponent(coinPaprikaBaseUri + endpoint);
    //     return {
    //         method: method,
    //         url: url
    //     }
    // }

    // function sendRequest(payload) {
    //     var deferred = $q.defer();
    //     $http(payload)
    //         .then(function successCallback(response) {
    //             deferred.resolve(response.data);
    //         }, function errorCallback(response) {
    //             deferred.reject({ status: response.status, data: response.data });
    //         });

    //     return deferred.promise;
    // };

    function getCoinMarket() {
        return VerusExplorerApi.getAggregatorMarketData('coinpaprika');
    };

    return {
        getCoinMarket: function () {
            return getCoinMarket();
        }
    };
});