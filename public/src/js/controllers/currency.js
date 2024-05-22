'use strict';

angular.module('insight.currency')
.controller('CurrencyController',
    function ($scope, $rootScope, CoinPaprika) {
        $rootScope.currency.symbol = defaultCurrency;

        var _getVrscUsdRate = function () {
            CoinPaprika.getVerusCoinMarket()
                .then(function (res) {
                    const bitstampRate = parseFloat(res[0].quotes.USD.price);
                    const poloniexRate = '1.00';
                    $rootScope.currency.factor = $rootScope.currency.bitstamp = (bitstampRate * poloniexRate);
                }).catch(function () {
                    $rootScope.currency.factor = $rootScope.currency.bitstamp = 0;
                });
        }

        var _roundFloat = function (x, n) {
            if (!parseInt(n, 10) || !parseFloat(x)) n = 0;

            return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
        };

        $rootScope.currency.getConvertion = function (value) {
            value = value * 1; // Convert to number

            if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
                if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

                var response;
                var decimalNum = 0;

                if (this.symbol === 'USD') {
                    response = _roundFloat((value * this.factor), 2);
                } else if (this.symbol === 'm' + netSymbol) {
                    this.factor = 1000;
                    response = _roundFloat((value * this.factor), 5);
                } else if (this.symbol === 'bits') {
                    this.factor = 1000000;
                    response = _roundFloat((value * this.factor), 2);
                } else {
                    this.factor = 1;
                    response = value;
                }

                // prevent sci notation
                if (response < 1e-7) response = response.toFixed(8);

                var num = response.toString().split('.');
                const decimalLength = !num[1] ? 5 : num[1].length;
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'decimal',
                    minimumFractionDigits: decimalLength
                });

                return formatter.format(response) + ' ' + this.symbol;
            }

            return 'value error';
        };

        $scope.setCurrency = function (currency) {
            $rootScope.currency.symbol = currency;
            localStorage.setItem('insight-currency', currency);

            if (currency === 'USD') {
                _getVrscUsdRate();
            } else if (currency === 'm' + netSymbol) {
                $rootScope.currency.factor = 1000;
            } else if (currency === 'bits') {
                $rootScope.currency.factor = 1000000;
            } else {
                $rootScope.currency.factor = 1;
            }
        };
        _getVrscUsdRate();
    }
);
