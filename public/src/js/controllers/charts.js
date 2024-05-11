'use strict';

angular
    .module('insight.charts', ["chart.js"])
    .controller('ChartsController',
    function (
        $scope,
        VerusExplorerApi
    ) {
            // function($scope, $rootScope, $routeParams, $location, Chart, Charts) {
            // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
            $scope.loading = false;



            // $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
            // $scope.data = [300, 500, 100];

            // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
            // $scope.series = ['Series A', 'Series B'];

            // $scope.data = [
            //   [65, 59, 80, 81, 56, 55, 40],
            //   [28, 48, 40, 19, 86, 27, 90]
            // ];

            // $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];
            // $scope.data = [
            //   [65, 59, 90, 81, 56, 55, 40],
            //   [28, 48, 40, 19, 96, 27, 100]
            // ];

            // $scope.series = ['Series A', 'Series B'];
            // $scope.data = [
            //   [{
            //     x: 40,
            //     y: 10,
            //     r: 20
            //   }],
            //   [{
            //     x: 10,
            //     y: 40,
            //     r: 50
            //   }]
            // ];


            // $scope.title = "Transaction Over Time";
            // $scope.labels = [
            //     "7:00",
            //     "7:10",
            //     "7:20",
            //     "7:30",
            //     "7:40",
            //     "7:50",
            //     "8:00",
            // ];
            // // $scope.series = ['Series A', 'Series B'];
            // $scope.series = ['Transactions'];
            // $scope.data = [
            //     [65, 59, 80, 81, 56, 55, 40],
            //     // [28, 48, 40, 19, 86, 27, 90]
            // ];
            // $scope.onClick = function (points, evt) {
            //     console.log(points, evt);
            // };
            // // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
            // $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
            // $scope.options = {
            //     type: 'line',
            //     scales: {
            //         yAxes: [
            //             {
            //                 id: 'y-axis-1',
            //                 type: 'linear',
            //                 display: true,
            //                 position: 'left'
            //             },
            //             // {
            //             //     id: 'y-axis-2',
            //             //     type: 'linear',
            //             //     display: true,
            //             //     position: 'right'
            //             // }
            //         ]
            //     }
            // };

            // TX over time
            // Block size distribution
            // Transaction Fees Over Time
            // Mining pool distribution over time

            $scope.init = function () {
                VerusExplorerApi
                .getChartData("last3Hours")
                .then(function(queryResult) {
                    const data = queryResult.data;
                    if (data[0]) {
                        createTxCountOverTimeData(data);
                    }
                });
            }

            const _getDateIndex = function(date, dataIntervalInMinutes) {
                var minutes = "00";
                const rawMinuteValue = date.getMinutes();
                if(rawMinuteValue < dataIntervalInMinutes) {
                    minutes = "00";
                }
        
                if(rawMinuteValue > dataIntervalInMinutes) {
                    if((rawMinuteValue % dataIntervalInMinutes) > 0) {                        
                        minutes = (rawMinuteValue - (rawMinuteValue % dataIntervalInMinutes)).toString().padStart(2, '0');
                    } else {
                        minutes = rawMinuteValue.toString().padStart(2, '0');
                    }
                }

                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hour = date.getHours().toString().padStart(2, '0');
                return {
                    label: month + '/' + day + ' ' + hour + ':' + minutes,
                    key: month + '-' + day + '_' + hour + ':' + minutes,
                };
            }

            const createTxCountOverTimeData = function (data) {
                $scope.title = "Transaction Over Time";
                $scope.series = ["Blocks", "Transactions"];
                const dataIntervalInMinutes = 10;
                var aggregate = {};
                var dateIndex = "";

                for(var i = 0; i < data.length; i++) {
                    const d = new Date(data[i].time * 1000);
                    const id = _getDateIndex(d, dataIntervalInMinutes);
                    dateIndex = id.key;
                    if(aggregate[dateIndex] == undefined) {
                        aggregate[dateIndex] = {
                            displayText: id.label,
                            blockCount: 0,
                            txCount: 0,
                        }
                    }
                    aggregate[dateIndex].blockCount = aggregate[dateIndex].blockCount + 1;
                    aggregate[dateIndex].txCount = aggregate[dateIndex].txCount + data[i].txs.length;
                }

                $scope.labels = [];
                $scope.data = [];
                var blockCount = [];
                var txCount = [];
                for (var key in aggregate) {
                    $scope.labels.unshift(aggregate[key].displayText);
                    blockCount.unshift(aggregate[key].blockCount);
                    txCount.unshift(aggregate[key].txCount);
                }

                $scope.data = [
                    blockCount,
                    txCount,
                ];
            }


            // $scope.list = function() {
            //   Charts.get({
            //   }, function(res) {
            //     $scope.charts = res.charts;
            //   });

            //   if ($routeParams.chartType) {
            //     $scope.chart();
            //   }
            // };

            // $scope.chart = function() {
            //   $scope.loading = true;

            //   Chart.get({
            //     chartType: $routeParams.chartType
            //   }, function(chart) {
            //     $scope.loading = false;
            //     $scope.chartType = $routeParams.chartType;
            //     $scope.chartName = chart.name;
            //     $scope.chart = c3.generate(chart);
            //   }, function(e) {
            //     if (e.status === 400) {
            //       $rootScope.flashMessage = 'Invalid chart: ' + $routeParams.chartType;
            //     }
            //     else if (e.status === 503) {
            //       $rootScope.flashMessage = 'Backend Error. ' + e.data;
            //     }
            //     else {
            //       $rootScope.flashMessage = 'Chart Not Found';
            //     }
            //     $location.path('/');
            //   });
            // };

            // $scope.params = $routeParams;

        });

// .config(['ChartJsProvider', function (ChartJsProvider) {
//   ChartJsProvider.setOptions({
//     colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
//   });
// }]);
