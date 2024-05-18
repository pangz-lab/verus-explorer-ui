'use strict';

angular
    .module('insight.charts', ["chart.js"])
    .controller('ChartsController', function() {})
    .controller('ChainBasicInfoChartController', ChainBasicInfo)
    .controller('BlockBasicInfoChartController', BlockBasicInfo)
    .controller('MiningBasicInfoChartController', MiningBasicInfo);
    // .config(['ChartJsProvider', function (ChartJsProvider) {
    //       ChartJsProvider.setOptions({
    //         colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    //       });
    //     }]);
    // function (
    //     $scope,
    //     VerusExplorerApi,
    //     LocalStore
    // ) {
    //         // function($scope, $rootScope, $routeParams, $location, Chart, Charts) {
    //         // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
    //         $scope.loading = false;
    //         const _saveToCache = function(data, key, ttl) {
    //             LocalStore.set(key, data, ttl);
    //         }



    //         // $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    //         // $scope.data = [300, 500, 100];

    //         // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    //         // $scope.series = ['Series A', 'Series B'];

    //         // $scope.data = [
    //         //   [65, 59, 80, 81, 56, 55, 40],
    //         //   [28, 48, 40, 19, 86, 27, 90]
    //         // ];

    //         // $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
    //         // $scope.data = [
    //         //   [65, 59, 90, 81, 56, 55, 40],
    //         //   [28, 48, 40, 19, 96, 27, 100]
    //         // ];

    //         // $scope.series = ['Series A', 'Series B'];
    //         // $scope.data = [
    //         //   [{
    //         //     x: 40,
    //         //     y: 10,
    //         //     r: 20
    //         //   }],
    //         //   [{
    //         //     x: 10,
    //         //     y: 40,
    //         //     r: 50
    //         //   }]
    //         // ];


    //         // $scope.title = "Transaction Over Time";
    //         // $scope.labels = [
    //         //     "7:00",
    //         //     "7:10",
    //         //     "7:20",
    //         //     "7:30",
    //         //     "7:40",
    //         //     "7:50",
    //         //     "8:00",
    //         // ];
    //         // // $scope.series = ['Series A', 'Series B'];
    //         // $scope.series = ['Transactions'];
    //         // $scope.data = [
    //         //     [65, 59, 80, 81, 56, 55, 40],
    //         //     // [28, 48, 40, 19, 86, 27, 90]
    //         // ];
    //         // $scope.onClick = function (points, evt) {
    //         //     console.log(points, evt);
    //         // };
    //         // // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    //         // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    //         // $scope.options = {
    //         //     type: 'line',
    //         //     scales: {
    //         //         yAxes: [
    //         //             {
    //         //                 id: 'y-axis-1',
    //         //                 type: 'linear',
    //         //                 display: true,
    //         //                 position: 'left'
    //         //             },
    //         //             // {
    //         //             //     id: 'y-axis-2',
    //         //             //     type: 'linear',
    //         //             //     display: true,
    //         //             //     position: 'right'
    //         //             // }
    //         //         ]
    //         //     }
    //         // };

    //         // TX over time
    //         // Block size distribution
    //         // Transaction Fees Over Time
    //         // Mining pool distribution over time
    //         const chartTypeName = chart.types.chainBasicInfoOverTime.apiName;
    //         const defaultRangeSelected = 3;
    //         const cacheKeys = localStore.charts.keys;
    //         const rangeSelectionOptions = [
    //             { label: '10min', key: 'last10Minutes', intervalInMinutes: 10, cache: cacheKeys.last10Minutes },
    //             { label: '30min', key: 'last30Minutes', intervalInMinutes: 10, cache: cacheKeys.last30Minutes },
    //             { label: '1hr', key: 'lastHour', intervalInMinutes: 10, cache: cacheKeys.lastHour },
    //             { label: '3hr', key: 'last3Hours', intervalInMinutes: 10, cache: cacheKeys.last3Hours },
    //             { label: '6hr', key: 'last6Hours', intervalInMinutes: 20, cache: cacheKeys.last6Hours },
    //             { label: '12hr', key: 'last12Hours', intervalInMinutes: 30, cache: cacheKeys.last12Hours },
    //             { label: '24hr', key: 'last24Hours', intervalInMinutes: 60, cache: cacheKeys.last24Hours },
    //             { label: '3d', key: 'last3Days', intervalInMinutes: 60 * 3, cache: cacheKeys.last3Days },
    //             { label: '1wk', key: 'last7Days', intervalInMinutes: 60 * 24, cache: cacheKeys.last7Days },
    //             { label: '2wk', key: 'last15Days', intervalInMinutes: 60 * 24 * 5, cache: cacheKeys.last15Days },
    //             { label: '30d', key: 'last30Days', intervalInMinutes: 60 * 24 * 10, cache: cacheKeys.last30Days },
    //             { label: '90d', key: 'last90Days', intervalInMinutes: 60 * 24 * 30, cache: cacheKeys.last90Days },
    //         ]
    //         $scope.rangeSelection = rangeSelectionOptions;
    //         $scope.rangeSelected = defaultRangeSelected;

    //         $scope.fetchChartData = function(range) {
    //             if(range == undefined) {
    //                 range = rangeSelectionOptions[defaultRangeSelected];
    //             }

    //             const cacheId = _getCacheIds(chartTypeName, range.cache);
    //             const cachedData = LocalStore.get(cacheId.key);
    //             if(cachedData != undefined) {
    //                 _createTxCountOverTimeData(null, range, cachedData);
    //                 return;
    //             }

    //             VerusExplorerApi
    //             .getChartData(chartTypeName, range.key)
    //             .then(function(queryResult) {
    //                 const data = queryResult.data;
    //                 if (!queryResult.error && data.labels[0] != undefined) { _createTxCountOverTimeData(data, range); }
    //             });
    //         }

    //         const _getCacheIds = function(cacheSuffix, cacheIds) {
    //             return {
    //                 key: cacheIds.key + ':' + cacheSuffix,
    //                 ttl: cacheIds.ttl
    //             }
    //         }

    //         const _createTxCountOverTimeData = function (data, range, cachedData) {
    //             $scope.title = "Transaction Over Time";
    //             $scope.series = ["Blocks", "Transactions"];
    //             $scope.labels = [];
    //             $scope.data = [];
    //             $scope.options = {
    //                 legend: {
    //                     display: true,
    //                     labels: {
    //                         color: 'red'
    //                     }
    //                 }
    //             };

    //             if(cachedData != undefined) {
    //                 $scope.labels = cachedData.labels;
    //                 $scope.data = cachedData.data;
    //                 return;
    //             }

    //             $scope.labels = data.labels
    //             $scope.data = data.data;

    //             const c = _getCacheIds(chartTypeName, range.cache)
    //             _saveToCache({labels: $scope.labels, data: $scope.data}, c.key, c.ttl);
    //         }
    //         // $scope.params = $routeParams;

    //     }
    // );

// .config(['ChartJsProvider', function (ChartJsProvider) {
//   ChartJsProvider.setOptions({
//     colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
//   });
// }]);