'use strict';

angular.module('insight.coinpaprika')
.factory('CoinPaprika',
function (VerusExplorerApi) {
    function getCoinMarket() {
        return VerusExplorerApi.getAggregatorMarketData('coinpaprika');
    };

    return {
        getCoinMarket: function () {
            return getCoinMarket();
        }
    };
});