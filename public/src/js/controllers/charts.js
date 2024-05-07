'use strict';

angular.module('insight.charts', ["chart.js"])
    .controller('ChartsController',
        function ($scope) {
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
                createTxCountOverTimeData();
            }


            const createTxCountOverTimeData = function () {
                // $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
                $scope.title = "Transaction Over Time";
                $scope.labels = [
                    "7:00",
                    "7:10",
                    "7:20",
                    "7:30",
                    "7:40",
                    "7:50",
                    "8:00",
                ];
                $scope.series = ['Transactions'];
    
                $scope.data = [
                  [65, 59, 80, 81, 56, 55, 40],
                  [28, 48, 40, 19, 86, 27, 90]
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
