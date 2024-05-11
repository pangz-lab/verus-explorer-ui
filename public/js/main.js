// Source: public/src/js/app.js
var testnet = false;
var netSymbol = testnet ? 'VRSCTEST' : 'VRSC';
const chainName = "Verus";
const coinpaprikaEndpointKey = "vrsc-verus-coin";
const firstBlockStartDate = new Date(2018, 4, 20);
const allowedSearchPattern = /^[a-zA-Z0-9@]+$/;
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:3001';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://api.verus.services';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-api-insight.pangz.tech'; //2223
const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-ws-insight.pangz.tech'; //2220 ws and express
const wsServer = testnet ? 'wss://wip-ws-insight.pangz.tech/verus/wss' : 'wss://wip-ws-insight.pangz.tech/verus/wss'; //2220 ws and express
// const wsServer = testnet ? 'wss://wip-ws-insight.pangz.tech/verus/wss' : 'ws://localhost:2220/verus/wss'; //2220 ws and express

// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:2220'; //2220 ws and express

// Need to secure the API token. Better put the API behind a gateway or a reverse proxy
const coinPaprikaBaseUri = 'https://api.coinpaprika.com/v1';
const apiToken =  testnet ? '' : 'Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28="';
const localStore = {
  status: { key: netSymbol + ':vexp_stats', ttl: 86400 },
  latestBlocks: { key: netSymbol + ':vexp_blocks_received', ttl: 86400 },
  latestBlockTxs: { key: netSymbol + ':vexp_txs_received', ttl: 86400 },
  nodeState: { key: netSymbol + ':vexp_chain_node_state', ttl: 86400 },
  // api: {
  //   blockchainHeight: { key: netSymbol + ':vexp_chain_height', ttl: 5 }
  // },
}

var defaultLanguage = localStorage.getItem('insight-language') || 'en';
var defaultCurrency = localStorage.getItem('insight-currency') || netSymbol;

angular.module('insight',[
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'gettext',
  'angularMoment',
  'insight.system',
  'insight.socket',
  'insight.blocks',
  'insight.transactions',
  'insight.address',
  'insight.search',
  'insight.charts',
  'insight.status',
  // 'insight.connection',
  'insight.currency',
  // 'insight.messages',
  'insight.verusdrpc',
  'insight.verusexplorerapi',
  'insight.wseventdatamanager',
  'insight.veruswssclient',
  'insight.localstore',
  'insight.coinpaprika'
  // 'chart.js'
]);

angular.module('insight.system', []);
angular.module('insight.socket', []);
angular.module('insight.blocks', []);
angular.module('insight.transactions', []);
angular.module('insight.address', []);
angular.module('insight.search', []);
angular.module('insight.charts', [])
angular.module('insight.status', []);
angular.module('insight.connection', []);
angular.module('insight.currency', []);
angular.module('insight.messages', []);
angular.module('insight.verusdrpc', []);
angular.module('insight.verusexplorerapi', []);
angular.module('insight.wseventdatamanager', []);
angular.module('insight.veruswssclient', []);
angular.module('insight.localstore', []);
angular.module('insight.coinpaprika', []);
// angular.module('chart.js', []);

// Source: public/src/js/controllers/address.js
angular
.module('insight.address')
.controller('AddressController',
    function (
        $scope,
        $rootScope,
        $routeParams,
        // $location,
        Global,
        // Address,
        // getSocket,
        // VerusdRPC,
        VerusExplorerApi,
        ScrollService
    ) {
        $scope.global = Global;

        $rootScope.scrollToTop = function () {
            ScrollService.scrollToTop();
        };
        $rootScope.scrollToBottom = function () {
            ScrollService.scrollToBottom();
        };

        // var socket = getSocket($scope);
        // var addrStr = $routeParams.addrStr;

        // var _startSocket = function() {
        //   socket.on('bitcoind/addresstxid', function(data) {
        //     if (data.address === addrStr) {
        //       $rootScope.$broadcast('tx', data.txid);
        //       var base = document.querySelector('base');
        //       var beep = new Audio(base.href + '/sound/transaction.mp3');
        //       beep.play();
        //     }
        //   });
        //   socket.emit('subscribe', 'bitcoind/addresstxid', [addrStr]);
        // };

        // var _stopSocket = function () {
        //   socket.emit('unsubscribe', 'bitcoind/addresstxid', [addrStr]);
        // };

        // socket.on('connect', function() {
        //   _startSocket();
        // });

        // $scope.$on('$destroy', function(){
        //   _stopSocket();
        // });

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

            $scope.addressBalance.loading = true;
            VerusExplorerApi
            .getAddressBalance(address)
            .then(function (addressBalance) {
                const data = addressBalance.data;
                $scope.addressBalance.loading = false;
                // if (data.balance) {
                //     $rootScope.flashMessage = 'Backend Error : ' + data.error.message + '(' + data.error.code + ')';
                //     // $location.path('/');
                //     return;
                // }

                // console.log("Data from address controller");
                // console.log(data);
                // // _paginate(data.result);
                // // $rootScope.titleDetail = address.addrStr.substring(0, 7) + '...';
                // $rootScope.titleDetail = $routeParams.addrStr.substring(0, 7) + '...';
                // $rootScope.flashMessage = null;
                // // $scope.address = $routeParams.addrStr;
                // $scope.address = $routeParams;
                // console.log(data);
                const balance = data.balance == undefined ? 0 : data.balance;
                const received = data.received == undefined ? 0 : data.received;
                $scope.balance = ((balance).toFixed(8) / 1e8).toString();
                $scope.totalReceived = ((received).toFixed(8) / 1e8).toString();
                $scope.totalSent = ((received - balance) / 1e8).toString();
            })
            .catch(function (e) {
                $scope.addressBalance.loading = false;
                $rootScope.flashMessage = 'Failed to load the balance summary. Reload to try again.';
                // if (e.status === 400) {
                //     $rootScope.flashMessage = 'Invalid Address: ' + $routeParams.addrStr;
                // } else if (e.status === 503) {
                //     $rootScope.flashMessage = 'Backend Error. ' + e.data;
                // } else {
                //     $rootScope.flashMessage = 'Address Not Found';
                // }
                // $location.path('/');
            });

            //   // Address.get({
            //   //     addrStr: $routeParams.addrStr
            //   //   },
            //   //   function(address) {
            //   //     $rootScope.titleDetail = address.addrStr.substring(0, 7) + '...';
            //   //     $rootScope.flashMessage = null;
            //   //     $scope.address = address;
            //   //   },
            //   //   function(e) {
            //   //     if (e.status === 400) {
            //   //       $rootScope.flashMessage = 'Invalid Address: ' + $routeParams.addrStr;
            //   //     } else if (e.status === 503) {
            //   //       $rootScope.flashMessage = 'Backend Error. ' + e.data;
            //   //     } else {
            //   //       $rootScope.flashMessage = 'Address Not Found';
            //   //     }
            //   //     $location.path('/');
            //   //   });
        };

    }
);

// Source: public/src/js/controllers/blocks.js
angular
.module('insight.blocks')
.controller('BlocksController',
    // function($scope, $rootScope, $routeParams, $location, Global, BlockByHeight, VerusdRPC, ScrollService, BlockService) {
    // function($scope, $rootScope, $routeParams, $location, Global, VerusdRPC, VerusExplorerApi, ScrollService, BlockService) {
    function (
        $scope,
        $rootScope,
        $routeParams,
        $location,
        // $window,
        Global,
        VerusExplorerApi,
        // VerusWssClient,
        ScrollService,
        BlockService
        // $interval
    ) {
        const MAX_HASH_PER_LOAD = 100;
        const dateUrlPath = "blocks-date";
        $scope.global = Global;
        $scope.loading = false;
        $scope.currentDateTxList = [];
        $scope.lastStartIndex = 0;
        $scope.remainingTxCount = 0;
        $scope.pagination = {};
        $scope.alert = {
            info: {
                message: "",
                show: false
            }
        }

        $rootScope.scrollToTop = function () {
            ScrollService.scrollToTop();
        };
        $rootScope.scrollToBottom = function () {
            ScrollService.scrollToBottom();
        };

        var _setAlertMessage = function(show, message) {
            $scope.alert = {
                info: {
                    message: message,
                    show: show
                }
            }
        }

        var _setCalendarDate = function (date) { $scope.dt = date; };
        $scope.setToday = function() {
            $location.path('blocks/');
        }

        var _createDatePaginationDisplay = function (date) {
            $scope.pagination = {};
            const d = new Date(date);
            var current = _formatTimestamp(d);
            var prev = new Date(d);
            var next = new Date(d);

            prev.setDate(prev.getDate() - 1);
            next.setDate(next.getDate() + 1);

            $scope.pagination = {
                current: current,
                prev: _formatTimestamp(prev),
                next: _formatTimestamp(next),
                currentTs: parseInt(d.getTime().toString().substring(0, 10)),
                isToday: _formatTimestamp(new Date()) == current
            };
        };

        var _formatTimestamp = function (date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = date.getDate().toString();

            return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
        };

        var _validateDate = function(value) {
            console.log("Date value");
            console.log(value);
            if(value > new Date()) {
                _setAlertMessage(true, "Choose current date or previous date only!");
                setTimeout(function() {
                    _setAlertMessage(false, "");
                }, 3000)
                return false;
            }

            if(value < firstBlockStartDate) {
                _setAlertMessage(true, "Choose date not later than " + firstBlockStartDate.toUTCString());
                setTimeout(function() {
                    _setAlertMessage(false, "");
                }, 3000)
                return false;
            }
            return true;
        }

        $scope.$watch('dt', function (newValue, oldValue) {
            const valid = _validateDate(newValue);
            if(!valid) { return; }
            if (newValue !== oldValue) {
                $location.path('/'+dateUrlPath+'/' + _formatTimestamp(new Date(newValue)));
            }
        });

        $scope.openCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.humanSince = function (time) {
            var m = moment.unix(time).startOf('day');
            var b = moment().startOf('day');
            return moment.min(m).from(b);
        };

        // TODO, put in a service
        var _getLastNElements = function (array, start, count) {
            var x = 0;
            var result = [];
            for (var i = start; i >= 0; i--) {
                if (x == count) { break; }
                result.push(array[i]);
                x += 1;
            }
            return result;
        }

        var _createBlockSummary = function (hashList, onEachTxSummary) {
            VerusExplorerApi
            .getGeneratedBlocks(hashList)
            .then(function (hashResult) {
                const data = hashResult.data;
                if (data[0]) { onEachTxSummary(data); }
                $scope.loading = false;
            });
        };

        var _getDateRange = function (dateTime) {
            var dateEnd = new Date(dateTime);
            var dateStart = new Date(dateTime);
            dateStart.setHours(0, 0, 0, 0);
            dateEnd.setHours(24, 0, 0, 0);
            return {
                start: parseInt(dateStart.getTime().toString().slice(0, 10)),
                end: parseInt(dateEnd.getTime().toString().slice(0, 10)),
            }
        };

        var _createDateFromString = function(dateString) {
            const splitDate = dateString.split('-');
            const year = parseInt(splitDate[0], 10);
            const month = parseInt(splitDate[1], 10);
            const day = parseInt(splitDate[2], 10);
            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const isoStr = day + ' ' + months[month - 1] + ' ' + year + ' 00:00:00';
            return  new Date(isoStr);
        }

        $scope.list = function () {
            $scope.loading = true;

            if ($routeParams.blockDate) {
                $scope.detail = $routeParams.blockDate;
                _validateDate(_createDateFromString($routeParams.blockDate));
            }

            if ($routeParams.startTimestamp) {
                var d = new Date($routeParams.startTimestamp * 1000);
                var m = d.getMinutes();
                if (m < 10) m = '0' + m;
                $scope.before = ' before ' + d.getHours() + ':' + m;
            }

            $rootScope.titleDetail = $scope.detail;

            const blockDate = $routeParams.blockDate == undefined ?
                (new Date()).toString() :
                _createDateFromString($routeParams.blockDate).toString();

            const range = _getDateRange(blockDate);
            _setCalendarDate(blockDate);
            _createDatePaginationDisplay(blockDate);

            VerusExplorerApi
            .getBlockHashesByRange(range.end, range.start)
            .then(function (hashResult) {
                const data = hashResult.data;
                if (hashResult.error) {
                    $scope.loading = false;
                    return;
                }
                $scope.currentDateTxList = data;

                $scope.lastStartIndex = $scope.currentDateTxList.length - 1;
                _createBlockSummary(
                    _getLastNElements(
                        $scope.currentDateTxList,
                        $scope.lastStartIndex,
                        MAX_HASH_PER_LOAD
                    ),
                    function (summary) {
                        var counter = 0;
                        summary.map(function (e) {
                            counter += 1;
                            $scope.blocks.push(e);
                            $scope.loading = !(counter == summary.length);
                        })
                    }
                );
            });
        };

        $scope.loadMorelist = function () {
            $scope.loading = true;
            $scope.remainingTxCount = $scope.lastStartIndex + 1;
            if ($scope.lastStartIndex < 0) {
                $scope.loading = false;
                return;
            }
            console.log("added more to list >>");
            $scope.lastStartIndex = $scope.lastStartIndex - MAX_HASH_PER_LOAD;

            _createBlockSummary(
                _getLastNElements(
                    $scope.currentDateTxList,
                    $scope.lastStartIndex,
                    MAX_HASH_PER_LOAD
                ),
                function (summary) {
                    summary.map(function (e) {
                    $scope.blocks.push(e);
                })
            });
        };

        $scope.findOne = function () {
            $scope.loading = true;

            VerusExplorerApi
            .getBlockInfo($routeParams.blockHash)
            .then(function (blockInfo) {
                const data = blockInfo.data;
                data.reward = BlockService.getBlockReward(data.height);
                data.isMainChain = (data.confirmations !== -1);

                const block = data;

                $rootScope.titleDetail = block.height;
                $rootScope.flashMessage = null;
                $scope.loading = false;
                $scope.block = block;
            })
            .catch(function (e) {
                if (e.status === 400) {
                    $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
                    return;
                } else if (e.status === 503) {
                    $rootScope.flashMessage = 'Backend Error. ' + e.data;
                    return;
                } else {
                    $rootScope.flashMessage = 'Block Not Found';
                }
                
                $location.path('/');
            });
            $scope.loading = false;
        };
        
        $scope.toGMT = function(date) {
            const d = (new Date(date * 1000)).toUTCString();
            return d.slice(0, d.length - 3);
        }
        
        $scope.toLocal = function(d) {
            // const d = (new Date(date * 1000)).toLocaleString();
            return d.slice(0, d.length - 3);
        }

        $scope.getTimeDifferenceFromGMT = function() {
            const date = new Date();
            const offsetMinutes = date.getTimezoneOffset();
            const offsetHours = Math.abs(offsetMinutes) / 60;
            const sign = offsetMinutes < 0 ? '+' : '-';
            // const formattedDifference = sign + ' ' + padNumber(Math.floor(offsetHours)) + ':' + padNumber(Math.abs(offsetMinutes % 60));
            const formattedDifference = 'GMT' + sign + Math.floor(offsetHours);
            return formattedDifference;
        }
        

        // $scope.isLocalTimeBehindGMT = function() {
        //     const localTime = new Date();
        //     const gmtTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60000);
        //     const b = localTime.getTime() < gmtTime.getTime();
        //     return b;
        // }

 

        // var lazyLoadingInterval = $interval(function () {
        //     console.log("Load more data every 2 seconds...");
        //     $scope.loadMorelist();
        // }, 2000);

        // setTimeout(function () {
        //     if(lazyLoadingInterval != undefined) {
        //         $interval.cancel(lazyLoadingInterval);
        //         lazyLoadingInterval = undefined;
        //     }
        // }, 10000); $scope.blocks = [];
        $scope.params = $routeParams;
        $scope.blocks = [];
        $scope.params = $routeParams;
    }
);

// Source: public/src/js/controllers/charts.js
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

// Source: public/src/js/controllers/connection.js
// 'use strict';

// angular.module('insight.connection').controller('ConnectionController',
//   function($scope
//     // $window,
//     // getSocket,
//     // PeerSync
//     ) {

//     // Set initial values
//     $scope.apiOnline = true;
//     $scope.serverOnline = true;
//     $scope.clienteOnline = true;

//     // var socket = getSocket($scope);

//     // // Check for the node server connection
//     // socket.on('connect', function() {
//     //   $scope.serverOnline = true;
//     //   socket.on('disconnect', function() {
//     //     $scope.serverOnline = false;
//     //   });
//     // });

//     // // Check for the  api connection
//     // $scope.getConnStatus = function() {
//     //   PeerSync.get({},
//     //     function(peer) {
//     //       $scope.apiOnline = peer.connected;
//     //       $scope.host = peer.host;
//     //       $scope.port = peer.port;
//     //     },
//     //     function() {
//     //       $scope.apiOnline = false;
//     //     });
//     // };

//     // socket.emit('subscribe', 'sync');
//     // socket.on('status', function(sync) {
//     //   $scope.sync = sync;
//     //   $scope.apiOnline = (sync.status !== 'aborted' && sync.status !== 'error');
//     // });

//     // // Check for the client conneciton
//     // $window.addEventListener('offline', function() {
//     //   $scope.$apply(function() {
//     //     $scope.clienteOnline = false;
//     //   });
//     // }, true);

//     // $window.addEventListener('online', function() {
//     //   $scope.$apply(function() {
//     //     $scope.clienteOnline = true;
//     //   });
//     // }, true);

//   });

// Source: public/src/js/controllers/currency.js
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
                    // Currency.get({}, function(res) {
                    //   $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
                    // });
                    _getVrscUsdRate();
                    // var url = "https://api.coinpaprika.com/v1/coins/vrsc-verus-coin/markets + '?callback=JSON_CALLBACK'";

                    // $http.jsonp(url)
                    // .success(function (data, status, headers, config) {
                    //   console.log("COINPPP");
                    //   console.log(data);
                    //   // $scope.details = data.found;
                    //   // $scope.statcode = status;

                    // })
                    // .error(function (data, status, headers, config) {
                    //   console.log("COINPPP error");
                    //   console.log(data);
                    //   console.log(status);
                    //   $scope.statcode = status;
                    // });




                } else if (currency === 'm' + netSymbol) {
                    $rootScope.currency.factor = 1000;
                } else if (currency === 'bits') {
                    $rootScope.currency.factor = 1000000;
                } else {
                    $rootScope.currency.factor = 1;
                }
            };

            // Get initial value
            // var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK";
            // var url = "https://api.coinpaprika.com/v1/coins/vrsc-verus-coin/markets";
            // const url = 'https://corsproxy.io/?' + encodeURIComponent('https://api.coinpaprika.com/v1/coins/vrsc-verus-coin/markets');

            // // $http.jsonp(url)
            // $http.get(url)
            // .success(function (data, status, headers, config) {
            //   console.log("COINPPP");
            //   console.log(data);
            //   // $scope.details = data.found;
            //   // $scope.statcode = status;

            // })
            // .error(function (data, status, headers, config) {
            //   console.log("EROR >>");
            //   console.log(status);
            //   $scope.statcode = status;
            // });



            // Currency.get({}, function(res) {
            //   $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
            // });
            _getVrscUsdRate();
        });

// Source: public/src/js/controllers/footer.js
angular.module('insight.system')
.controller('FooterController',
    function (
        $scope,
        $route,
        $templateCache,
        gettextCatalog,
        amMoment,
        Version) {

        $scope.defaultLanguage = defaultLanguage;

        var _getVersion = function () {
            Version.get({},
                function (res) {
                    $scope.version = res.version;
                });
        };

        $scope.version = _getVersion();

        $scope.availableLanguages = [{
            name: 'English',
            isoCode: 'en',
        }, {
            name: 'Deutsch',
            isoCode: 'de_DE',
        }, {
            name: 'Русский',
            isoCode: 'ru',
        }, {
            name: 'Spanish',
            isoCode: 'es',
        }, {
            name: 'Japanese',
            isoCode: 'ja',
        }];

        $scope.setLanguage = function (isoCode) {
            gettextCatalog.currentLanguage = $scope.defaultLanguage = defaultLanguage = isoCode;
            amMoment.changeLocale(isoCode);
            localStorage.setItem('insight-language', isoCode);
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        };

    });

// Source: public/src/js/controllers/header.js
angular
.module('insight.system')
.controller('HeaderController',
    // function($scope, $rootScope, $modal, getSocket, Global, Block) {
    function ($scope, $rootScope, $modal, Global, $location) {
        $scope.global = Global;

        $rootScope.currency = {
            factor: 1,
            bitstamp: 0,
            testnet: testnet,
            netSymbol: netSymbol,
            symbol: netSymbol
        };
        // $scope.currentPath = $location.path();

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

        // var _getBlock = function(hash) {
        //   Block.get({
        //     blockHash: hash
        //   }, function(res) {
        //     $scope.totalBlocks = res.height;
        //   });
        // };

        // var socket = getSocket($scope);
        // socket.on('connect', function() {
        //   socket.emit('subscribe', 'inv');

        //   socket.on('block', function(block) {
        //     var blockHash = block.toString();
        //     _getBlock(blockHash);
        //   });
        // });
        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $rootScope.isCollapsed = true;
    });

// Source: public/src/js/controllers/index.js
angular
.module('insight.system')
.controller('IndexController',
    function (
        $scope,
        Global,
        VerusWssClient,
        LocalStore,
        WsEventDataManager
    ) {
        $scope.global = Global;
        $scope.chainName = chainName;

        const wsTopic = VerusWssClient.getMessageTopic();
        $scope.$on(wsTopic, function(_, rawEventData) {
            console.log("Getting message from main listener [INDEXCTRL]...", rawEventData)
            if( rawEventData.latestBlock.error
                || rawEventData.latestTxs.error
                || rawEventData.nodeState.error
                || rawEventData.status.error) { return; }
            
            setTimeout(function() {
                if(rawEventData.latestBlock.data !== undefined) {
                    $scope.blocks = WsEventDataManager.updateBlocksScopeData(
                        [rawEventData.latestBlock.data],
                        false
                    );
                }

                if(rawEventData.latestTxs.data !== undefined) {
                    $scope.txs = WsEventDataManager.updateTxHashScopeData(rawEventData.latestTxs.data, false);
                }

                $scope.cachedData.visible = false;
                $scope.$apply();
            }, 100);
        });

        $scope.loadData = function () {
            const blocks = LocalStore.get(localStore.latestBlocks.key);
            if(blocks != undefined) {
                $scope.blocks = WsEventDataManager.updateBlocksScopeData(blocks, true)
            }

            const txs = LocalStore.get(localStore.latestBlockTxs.key);
            if(txs != undefined) {
                $scope.txs = WsEventDataManager.updateTxHashScopeData(txs, true);
            }

            const status = LocalStore.get(localStore.status.key);
            if(status.blocks != undefined) {
                var maxHeight = 0;
                blocks.forEach(function(item) {
                    if(item.height > maxHeight) {
                        maxHeight = item.height;
                    }
                });

                $scope.cachedData.visible = status.blocks != maxHeight;
                if($scope.cachedData.visible) {
                    const missedBlockStart = maxHeight + 1;
                    $scope.cachedData.missedBlocks = {
                        start: missedBlockStart,
                        end: status.blocks,
                        diff: status.blocks - maxHeight
                    };
                }
            }
        };


        // Put in a separate service
        $scope.humanSince = function (time) {
            var m = moment.unix(time);
            return moment.min(m).fromNow();
        };

        $scope.txs = [];
        $scope.blocks = [];
        $scope.chainNodeState = [];
        $scope.cachedData = {
            visible: true,
            missedBlocks: {start: 0, end: 0, diff: 0}
        };
});

// Source: public/src/js/controllers/messages.js
// 'use strict';

// angular.module('insight.messages').controller('VerifyMessageController',
//   function($scope, $http) {
//   $scope.message = {
//     address: '',
//     signature: '',
//     message: ''
//   };
//   $scope.verification = {
//     status: 'unverified',  // ready|loading|verified|error
//     result: null,
//     error: null,
//     address: ''
//   };

//   $scope.verifiable = function() {
//     return ($scope.message.address
//             && $scope.message.signature
//             && $scope.message.message);
//   };
//   $scope.verify = function() {
//     $scope.verification.status = 'loading';
//     $scope.verification.address = $scope.message.address;
//     $http.post(window.apiPrefix + '/messages/verify', $scope.message)
//       .success(function(data, status, headers, config) {
//         if(typeof(data.result) != 'boolean') {
//           // API returned 200 but result was not true or false
//           $scope.verification.status = 'error';
//           $scope.verification.error = null;
//           return;
//         }

//         $scope.verification.status = 'verified';
//         $scope.verification.result = data.result;
//       })
//       .error(function(data, status, headers, config) {
//         $scope.verification.status = 'error';
//         $scope.verification.error = data;
//       });
//   };

//   // Hide the verify status message on form change
//   var unverify = function() {
//     $scope.verification.status = 'unverified';
//   };
//   $scope.$watch('message.address', unverify);
//   $scope.$watch('message.signature', unverify);
//   $scope.$watch('message.message', unverify);
// });

// Source: public/src/js/controllers/scanner.js
angular.module('insight.system').controller('ScannerController',
  function($scope, $rootScope, $modalInstance, Global) {
    $scope.global = Global;

    // Detect mobile devices
    var isMobile = {
      Android: function() {
          return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
          return navigator.userAgent.match(/IEMobile/i);
      },
      any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    $scope.isMobile = isMobile.any();
    $scope.scannerLoading = false;

    var $searchInput = angular.element(document.getElementById('search')),
        cameraInput,
        video,
        canvas,
        $video,
        context,
        localMediaStream;

    var _scan = function(evt) {
      if ($scope.isMobile) {
        $scope.scannerLoading = true;
        var files = evt.target.files;

        if (files.length === 1 && files[0].type.indexOf('image/') === 0) {
          var file = files[0];

          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
              var mpImg = new MegaPixImage(file);
              mpImg.render(canvas, { maxWidth: 200, maxHeight: 200, orientation: 6 });

              setTimeout(function() {
                qrcode.width = canvas.width;
                qrcode.height = canvas.height;
                qrcode.imagedata = context.getImageData(0, 0, qrcode.width, qrcode.height);

                try {
                  //alert(JSON.stringify(qrcode.process(context)));
                  qrcode.decode();
                } catch (e) {
                  alert(e);
                }
              }, 1500);
            };
          })(file);

          // Read  in the file as a data URL
          reader.readAsDataURL(file);
        }
      } else {
        if (localMediaStream) {
          context.drawImage(video, 0, 0, 300, 225);

          try {
            qrcode.decode();
          } catch(e) {
            //qrcodeError(e);
          }
        }

        setTimeout(_scan, 500);
      }
    };

    var _successCallback = function(stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      localMediaStream = stream;
      video.play();
      setTimeout(_scan, 1000);
    };

    var _scanStop = function() {
      $scope.scannerLoading = false;
      $modalInstance.close();
      if (!$scope.isMobile) {
        if (localMediaStream.stop) localMediaStream.stop();
        localMediaStream = null;
        video.src = '';
      }
    };

    var _videoError = function(err) {
      console.log('Video Error: ' + JSON.stringify(err));
      _scanStop();
    };

    qrcode.callback = function(data) {
      _scanStop();

      var str = (data.indexOf('verus:') === 0) ? data.substring(8) : data;
      console.log('QR code detected: ' + str);
      $searchInput
        .val(str)
        .triggerHandler('change')
        .triggerHandler('submit');
    };

    $scope.cancel = function() {
      _scanStop();
    };

    $modalInstance.opened.then(function() {
      $rootScope.isCollapsed = true;
      
      // Start the scanner
      setTimeout(function() {
        canvas = document.getElementById('qr-canvas');
        context = canvas.getContext('2d');

        if ($scope.isMobile) {
          cameraInput = document.getElementById('qrcode-camera');
          cameraInput.addEventListener('change', _scan, false);
        } else {
          video = document.getElementById('qrcode-scanner-video');
          $video = angular.element(video);
          canvas.width = 300;
          canvas.height = 225;
          context.clearRect(0, 0, 300, 225);

          navigator.getUserMedia({video: true}, _successCallback, _videoError); 
        }
      }, 500);
    });
});

// Source: public/src/js/controllers/search.js
angular
.module('insight.search')
.controller('SearchController',
    function (
        $scope,
        $location,
        $timeout,
        Global,
        VerusExplorerApi
    ) {
        $scope.global = Global;
        $scope.loading = false;

        

        var _badQuery = function () {
            $scope.badQuery = true;
            $timeout(function () {
                $scope.badQuery = false;
            }, 2000);
        };

        var _resetSearch = function () {
            $scope.q = '';
            $scope.loading = false;
        };

        const _createPath = function(q) {
            const v = q.value;
            switch(q.type) {
                case 'block': return 'block/' + v;
                case 'blockHash': return 'block/' + v;
                case 'verusId': return 'address/' + v;
                case 'address': return 'address/' + v;
                case 'txHash': return 'tx/' + v;
            }
            return undefined;
        }

        var _badSearch = function() {
            $scope.loading = false;
            _resetSearch();
            _badQuery();
        }

        $scope.search = function () {
            var q = $scope.q;
            $scope.badQuery = false;
            $scope.loading = true;
            
            if($location.path().endsWith(q)) {
                _resetSearch();
                return;
            }
            if(q.length > 200 || !allowedSearchPattern.test(q)) {
                _badSearch();
            }

            try {
                VerusExplorerApi
                .search(q)
                .then(function (r) {
                    const path = _createPath(r.data);
                    if(r.error || path == undefined) {
                        _badSearch();
                        return;
                    }

                    $location.path(path);
                    $scope.loading = false;
                    _resetSearch();
                })
                
            } catch (e) {;
                __badSearch();
            }
            
            // const lastChar = q.charAt(q.length - 1);

            // if (lastChar === '@') {
            //     VerusExplorerApi
            //     .getIdentity(q)
            //     .then(function (idInfo) {
            //         if (idInfo.data.identity) {
            //             //Request is a VerusID - get the address
            //             $location.path('address/' + idInfo.data.identity.identityaddress);
            //             _resetSearch();
            //             return;
            //         }

            //         $scope.loading = false;
            //         _resetSearch();
            //         _badQuery();
            //     });
            //     return;
            // }

            // VerusExplorerApi
            // .getBlockInfo(q)
            // .then(function (blockInfo) {
            //     if (blockInfo.data.hash) {
            //         // Either block height or block hash
            //         $location.path('block/' + blockInfo.data.hash);
            //         _resetSearch();
            //         return;
            //     }

            //     VerusExplorerApi
            //     .getAddressTxIds(q)
            //     .then(function (r) {
            //         if (r.data[0]) {
            //             //Request is address
            //             $location.path('address/' + q);
            //             _resetSearch();
            //             return;
            //         }

            //         VerusExplorerApi
            //         .getTransactionInfo(q)
            //         .then(function (r) {
            //             if (r.data.height) {
            //                 //Request is a transaction hash
            //                 $location.path('tx/' + q);
            //                 _resetSearch();
            //                 return;
            //             }

            //             $scope.loading = false;
            //             _resetSearch();
            //             _badQuery();
            //         })
            //     })
            // });
            // 2558891ef5d54ce3e82503655a22c05a774e62be695bbe26454dae93de480cac - 64
            // iHbTMYB43xqqFVmEqJkqff6GrZDQoaiq6g - 34

            // Block.get({
            //   blockHash: q
            // }, function() {
            //   _resetSearch();
            //   $location.path('block/' + q);
            // }, function() { //block not found, search on TX
            //   Transaction.get({
            //     txId: q
            //   }, function() {
            //     _resetSearch();
            //     $location.path('tx/' + q);
            //   }, function() { //tx not found, search on Address
            //     Address.get({
            //       addrStr: q
            //     }, function() {
            //       _resetSearch();
            //       $location.path('address/' + q);
            //     }, function() { // block by height not found
            //       if (isFinite(q)) { // ensure that q is a finite number. A logical height value.
            //         BlockByHeight.get({
            //           blockHeight: q
            //         }, function(hash) {
            //           _resetSearch();
            //           $location.path('/block/' + hash.blockHash);
            //         }, function() { //not found, fail :(
            //           $scope.loading = false;
            //           _badQuery();
            //         });
            //       }
            //       else {
            //         $scope.loading = false;
            //         _badQuery();
            //       }
            //     });
            //   });
            // });
        };

    }
);

// Source: public/src/js/controllers/status.js
angular
.module('insight.status')
.controller('StatusController',
    function (
        $scope,
        Global,
        VerusExplorerApi,
        VerusWssClient,
        UnitConversionService,
        LocalStore,
        WsEventDataManager
    ) {
        $scope.chainName = chainName;
        $scope.global = Global;
        $scope.info = { blocks: 0 };
        $scope.sync = { syncPercentage: 0 };
        $scope.chainNodeState = {};
        const CACHE_KEY_STATUS = localStore.status.key;
        // const CACHE_TTL_STATUS = localStore.status.ttl;// 24 hours
        const CACHE_KEY_NODE_STATE = localStore.nodeState.key;
        // const CACHE_TTL_NODE_STATE = localStore.nodeState.ttl;
        // const saveToCache = function(data, key, ttl) {
        //     LocalStore.set(key, data, ttl);
        // }

        const wsTopic = VerusWssClient.getMessageTopic();
        $scope.$on(wsTopic, function(event, rawEventData) {
            // console.log("Getting message from main listener ...", rawEventData)

            // //Data here is already managed in index.js to maintain realtime update
            // //even if viewing other tabs
            // setTimeout(function() {
            //     const chainStatus = LocalStore.get(CACHE_KEY_STATUS);
            //     if(chainStatus != undefined) {
            //         $scope.info = WsEventDataManager.updateStatusScopeData(chainStatus);
            //     }

            //     const nodeStateCache = LocalStore.get(CACHE_KEY_NODE_STATE);
            //     if(nodeStateCache != undefined) {
            //         const r = WsEventDataManager.updateChainNodeStateScopeData(nodeStateCache);
            //         $scope.sync = r.sync;
            //         $scope.chainNodeState = r.chainNodeState;
            //     }
            //     $scope.$apply();
            // }, 2000);

            if(rawEventData.nodeState.data !== undefined) {
                const r = WsEventDataManager.updateChainNodeStateScopeData(rawEventData.nodeState.data);
                $scope.sync = r.sync;
                $scope.chainNodeState = r.chainNodeState;
            }

            if(
                rawEventData.status.data == undefined 
                || rawEventData.status.error
                || rawEventData.status.data.blocks <= $scope.info.blocks) {
                return;
            }
            
            setTimeout(function() {
                $scope.info = WsEventDataManager.updateStatusScopeData(rawEventData.status.data);
                $scope.$apply();
            }, 500);
        });

        $scope.shortenValue = function (v) {
            if (v == null) return '';
            return parseFloat(v).toFixed(2);
        };
        $scope.convertValue = function (v, unit) {
            if (v == null) return '';
            return UnitConversionService.convert(parseFloat(v), unit);
        };

        // const updateStatusScopeData = function(data) {
        //     $scope.info = data;
        //     saveToCache(data, CACHE_KEY_STATUS, CACHE_TTL_STATUS);
        // }

        // function updateChainNodeStateScopeData(data) {
        //     $scope.chainNodeState = data;
        //     $scope.sync = data;
        //     $scope.sync.error = data == undefined;
        //     saveToCache($scope.chainNodeState, CACHE_KEY_NODE_STATE, CACHE_TTL_NODE_STATE);
        // }

        $scope.getBlockchainStatus = function () {
            const chainStatus = LocalStore.get(CACHE_KEY_STATUS);
            if(chainStatus != undefined) {
                $scope.info = WsEventDataManager.updateStatusScopeData(chainStatus);
            }

            const nodeStateCache = LocalStore.get(CACHE_KEY_NODE_STATE);
            if(nodeStateCache != undefined) {
                const r = WsEventDataManager.updateChainNodeStateScopeData(nodeStateCache);
                $scope.sync = r.sync;
                $scope.chainNodeState = r.chainNodeState;
            }

            VerusExplorerApi
                .getBlockchainStatus()
                .then(function (statusResult) {
                    if(statusResult.error) { return; }

                    if(!statusResult.data.status.error) {
                        $scope.info = WsEventDataManager.updateStatusScopeData(statusResult.data.status.data);
                    }
                    
                    if(!statusResult.data.nodeState.error) {
                        const r = WsEventDataManager.updateChainNodeStateScopeData(statusResult.data.nodeState.data);
                        $scope.sync = r.sync;
                        $scope.chainNodeState = r.chainNodeState;
                    }
                    $scope.loaded = true;
                });
        };

        $scope.humanSince = function (time) {
            var m = moment.unix(time / 1000);
            return moment.min(m).fromNow();
        };
    });

// Source: public/src/js/controllers/transactions.js
angular.module('insight.transactions')
.controller('TransactionsController',
    function (
        $scope,
        $rootScope,
        $routeParams,
        Global,
        VerusExplorerApi
    ) {
        $scope.global = Global;
        $scope.loading = true;
        $scope.loadedBy = null;
        $scope.addressTxCount = 0;
        const unknownAddress = '-1';

        var txVoutTotalValue = 0;
        var txVinTotalValue = 0;

        var _aggregateItems = function (items, callback) {
            if (!items) return [];
            var l = items.length;
            for (var i = 0; i < l; i++) {
                callback(items, i);
            }
        };

        var _processTX = function (tx, currentBlockHeight) {
            console.log("VIN >>");
            txVinTotalValue = 0;
            txVoutTotalValue = 0;
            addressCommitments = {};
            const hasVin = tx.vin != undefined && tx.vin[0] != undefined;
            // const hasVout = tx.vout != undefined && tx.vout[0] != undefined;
            ///////////////////////////////////
            // vin operation
            ///////////////////////////////////
            _aggregateItems(tx.vin == undefined ? [] : tx.vin, function (items, i) {
                items[i].uiWalletAddress = (typeof (items[i].addresses) === "object")
                    ? items[i].addresses[0]
                    // Older TXs
                    : items[i].address;

                txVinTotalValue += items[i].value;
            });

            ///////////////////////////////////
            // vout operation
            ///////////////////////////////////
            _aggregateItems(tx.vout, function (items, i) {
                // console.log(typeof(items[i].scriptPubKey.addresses));
                const addressType = typeof (items[i].scriptPubKey.addresses);
                const pubKeyAddressess = items[i].scriptPubKey.addresses ? items[i].scriptPubKey.addresses : [];
                var isIdentityTx = false;
                var identityPrimaryName = "";
                var uiWalletAddress = "";

                if (addressType === "object" && items[i].scriptPubKey.identityprimary) {
                    // VerusID transaction
                    // Get the first primary address
                    isIdentityTx = true;
                    uiWalletAddress = items[i].scriptPubKey.identityprimary.primaryaddresses[0];
                    identityPrimaryName = items[i].scriptPubKey.identityprimary.name + '@';

                } else if (addressType === "object") {
                    // Array of addresses - get the first one
                    uiWalletAddress = pubKeyAddressess[0];
                } else {
                    uiWalletAddress = pubKeyAddressess.join(",");
                }


                // tx.vout[i].uiWalletAddress = uiWalletAddress[0] == undefined ? ' [ NO ADDRESS ] ' : uiWalletAddress;
                tx.vout[i].uiWalletAddress = uiWalletAddress[0] == undefined ? unknownAddress : uiWalletAddress;
                tx.vout[i].isSpent = items[i].spentTxId;
                tx.vout[i].multipleAddress = pubKeyAddressess.join(',');
                tx.vout[i].identityTxTypeLabel = "...";
                tx.vout[i].othercommitment = _getOtherTxCommitment(items[i].scriptPubKey);
                tx.vout[i].pbaasCurrencies = _getPbaasCommitment(items[i].scriptPubKey);
                tx.vout[i].isPbaasCurrencyExist = tx.vout[i].pbaasCurrencies[0] != undefined;

                txVoutTotalValue += items[i].value;

                if (isIdentityTx) {
                    VerusExplorerApi
                    .getIdentity(identityPrimaryName, tx.height)
                    .then(function (idInfo) {
                        const data = idInfo.data;
                        tx.vout[i].identityTxTypeLabel = (data.result) ? "📇 Verus ID Mutation" : "🪪 Identity Commitment";
                    });
                }
            });


            // New properties calculated manually
            tx.confirmations = tx.height ? currentBlockHeight - tx.height + 1 : 0;
            tx.size = tx.hex.length / 2;
            txVoutTotalValue = parseFloat(txVoutTotalValue);
            tx.valueOut = txVoutTotalValue.toFixed(8);
            tx.isNewlyCreatedCoin = hasVin && tx.vin[0].coinbase != undefined;
            tx.shieldedSpend = [];
            tx.shieldedOutput = [];

            if (tx.overwintered && tx.version >= 4) {
                tx.shieldedSpend = tx.vShieldedSpend;
                tx.shieldedOutput = tx.vShieldedOutput;
            }

            tx.fees = parseFloat((txVinTotalValue - txVoutTotalValue).toFixed(8));
            if (tx.valueBalance != undefined) {
                if (tx.vout[0] == undefined) {
                    tx.fees = parseFloat((tx.valueBalance + txVinTotalValue).toFixed(8));
                } else if (tx.vin[0] == undefined) {
                    tx.fees = parseFloat((tx.valueBalance - txVoutTotalValue).toFixed(8));
                } else {
                    tx.fees = parseFloat(((txVinTotalValue - txVoutTotalValue) + tx.valueBalance).toFixed(8));
                }
            }

            // TODO
            // 2. Update full view for transaction
            // 3. fix sequence or just remove the tx counter? http://localhost:2222/address/iLAZzpXuQpapbysYzLNUDLbpLuGr6NwhbH
        };

        var _getPbaasCommitment = function (scriptPubKey) {
            if (scriptPubKey.reserve_balance == undefined) {
                return [];
            }
            var pbaasBalances = [];
            const currencies = Object.entries(scriptPubKey.reserve_balance);
            for (var i = 0; i < currencies.length; i++) {
                const currency = currencies[i];
                pbaasBalances.push(currency[1] + ' ' + currency[0]);
            }
            return pbaasBalances;
        }

        var _getOtherTxCommitment = function (scriptPubKey) {
            if (scriptPubKey.crosschainimport) return '📥 Crosschain Import';
            if (scriptPubKey.crosschainexport) return '📤 Crosschain Export';
            if (scriptPubKey.identitycommitment) return scriptPubKey.identitycommitment;
            if (scriptPubKey.reservetransfer) return '💱 Reserve Transfer';
            if (scriptPubKey.pbaasNotarization) return '⛓ PBaaS Notarization';
            return '';
        }


        //////////////////////////////////////////////////////////////////////////
        // Common method for transaction and address pages
        //////////////////////////////////////////////////////////////////////////
        var _findTx = function (txid) {
            // TODO - improve this.
            // reduce getBlockCount call, add cooldown time based on the last request
            // localstorage can be used
            VerusExplorerApi
            .getBlockchainHeight()
            .then(function (blockHeight) {
                VerusExplorerApi
                .getTransactionInfo(txid)
                .then(function (rawTx) {
                    const blockData = blockHeight.data;
                    const rawTxData = rawTx.data; 
                    // console.log(" GETTING >>>");
                    // console.log(blockData);
                    // console.log(rawTxData);
                    $rootScope.flashMessage = null;
                    _processTX(rawTxData, blockData);
                    $scope.tx = rawTxData;
                    
                    // Used for address page only(not for transaction page)
                    rawTxData.timing = new Date(rawTxData.time).getTime();
                    $scope.txs.push(rawTxData);
                })
                .catch(function (e) {
                    $rootScope.flashMessage = 'Failed to load transaction '+txid+'. Reload to try again.';
                    // if (e.status === 400) {
                    //     $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
                    // } else if (e.status === 503) {
                    //     $rootScope.flashMessage = 'Backend Error. ' + e.data;
                    // } else {
                    //     $rootScope.flashMessage = 'Transaction Not Found';
                    // }

                    // $location.path('/');
                });

            });
        };


        //////////////////////////////////////////////////////////////////////////
        // Address page helper methods
        //////////////////////////////////////////////////////////////////////////
        const MAX_ITEM_PER_SCROLL = 5;
        // const START_TX_INDEX_OFFSET = 2;
        $scope.isGettingAllTx = true;
        // One item is preloaded after getting all the txs so index 0 is already occupied
        $scope.startTransactionIndex = null;
        $scope.preProcessedTxIds = [];
        $rootScope.addressPage = { transactionCount: 0 }

        var _getAllAddressTxs = function () {
            $scope.isGettingAllTx = true;
            $scope.hasTxFound = false;
            $scope.loading = true;

            VerusExplorerApi
            .getAddressTxIds($routeParams.addrStr)
            .then(function (txIds) {
                const data = txIds.data;
                $scope.preProcessedTxIds = data;
                $scope.addressTxCount = data.length;
                $scope.hasTxFound = data[0];

                $scope.startTransactionIndex = data.length - 1;
                _paginate(
                    _getLastNElements(
                        $scope.preProcessedTxIds,
                        $scope.startTransactionIndex,
                        MAX_ITEM_PER_SCROLL));

                $rootScope.addressPage = { transactionCount: $scope.preProcessedTxIds.length };
                $scope.isGettingAllTx = false;
            });
        }

        var _getAllBlockTxs = function (hashes) {
            $scope.isGettingAllTx = true;
            $scope.hasTxFound = false;
            $scope.blockTxCount = hashes.length;
            // $scope.hasTxFound = false;

            // VerusdRPC.getAddressTxIds([$routeParams.addrStr])
            // .then(function(data) {
            //   $scope.preProcessedTxIds = data.result;
            //   $scope.hasTxFound = data.result[0];
            //   // Decremented in _findTx method
            //   startIndexLabel = $scope.preProcessedTxIds.length + 1;

            //   $scope.startTransactionIndex = data.result.length - 1;
            //   _paginate(_getLastNElements($scope.preProcessedTxIds, $scope.startTransactionIndex, MAX_ITEM_PER_SCROLL));


            //   $rootScope.addressPage = { transactionCount: $scope.preProcessedTxIds.length };
            //   $scope.isGettingAllTx = false;
            // });
            // console.log("hashes >>>");
            // console.log(hashes);

            // startIndexLabel = $scope.preProcessedTxIds.length + 1;
            $scope.preProcessedTxIds = hashes;
            $scope.startTransactionIndex = hashes.length - 1;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL));

            $scope.isGettingAllTx = false;
            $scope.hasTxFound = hashes[0];
        }

        // TODO, put in a service
        var _getLastNElements = function (a, start, count) {
            var x = 0;
            var result = [];
            for (var i = start; i >= 0; i--) {
                if (x == count) { break; }
                result.push(a[i]);
                x += 1;
            }
            // console.log(result);
            return result;
        }

        var _byBlock = function () {
            $scope.startTransactionIndex = $scope.startTransactionIndex - MAX_ITEM_PER_SCROLL;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL
                ));

            $scope.loading = false;
        };

        var _byAddress = function () {
            $scope.startTransactionIndex = $scope.startTransactionIndex - MAX_ITEM_PER_SCROLL;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL));

            $scope.loading = false;
        };


        var _paginate = function (data) {
            pagesTotal = data.length;
            // pageNum += 1;

            // data.txs.forEach(function(tx) {
            //startIndexLabel = txStart
            // console.log(data);
            data.forEach(function (tx) {

                // startIndexLabel -= 1;  
                _findTx(tx);
                // const lastTx = $scope.tx;
                // $scope.txs.push(lastTx);
                // $scope.txIndexLabel[lastTx.time] = (startIndexLabel -= 1);
                // $scope.txs.push(tx);
            });
            $scope.loading = false;
        };


        $scope.findThis = function () {
            _findTx($routeParams.txId);
        };

        //Initial load
        $scope.load = function (from, hashes) {
            $scope.loadedBy = from;
            // if($scope.preProcessedTxIds[0] == undefined) {
            if ($scope.loadedBy === 'address') {
                _getAllAddressTxs();
            } else {
                // console.log("hashes >>>");
                // console.log(hashes);
                _getAllBlockTxs(hashes);
                // _paginate(_getLastNElements($scope.preProcessedTxIds, $scope.startTransactionIndex, MAX_ITEM_PER_SCROLL));
            }
            // }
            $scope.loadMore();
        };

        //Load more transactions for pagination
        $scope.loadMore = function () {
            // if (pageNum < pagesTotal && !$scope.loading) {

            if ($scope.loadedBy === 'address') {
                _byAddress();
                // $scope.loading = false;
            } else {
                _byBlock();
            }
            // }
        };

        // Highlighted txout

        if ($routeParams.v_type == '>' || $routeParams.v_type == '<') {
            $scope.from_vin = $routeParams.v_type == '<' ? true : false;
            $scope.from_vout = $routeParams.v_type == '>' ? true : false;
            $scope.v_index = parseInt($routeParams.v_index);
            // console.log("v_index >>> ");
            // console.log($scope.from_vin);
            // console.log($scope.v_index);

            $scope.itemsExpanded = true;
        }

        //Init without txs
        $scope.txs = [];
        // If there's a memory issue, this can be removed.
        // This only serves as the index counter in each tx card
        $scope.txIndexLabel = {};

        $scope.$on('tx', function (event, txid) {
            _findTx(txid);
        });

    }
);


angular.module('insight.transactions').controller('SendRawTransactionController',
    function ($scope, $http) {
        $scope.transaction = '';
        $scope.status = 'ready';  // ready|loading|sent|error
        $scope.txid = '';
        $scope.error = null;

        $scope.formValid = function () {
            return !!$scope.transaction;
        };
        $scope.send = function () {
            var postData = {
                rawtx: $scope.transaction
            };
            $scope.status = 'loading';
            $http.post(window.apiPrefix + '/tx/send', postData)
                .success(function (data, status, headers, config) {
                    if (typeof (data.txid) != 'string') {
                        // API returned 200 but the format is not known
                        $scope.status = 'error';
                        $scope.error = 'The transaction was sent but no transaction id was got back';
                        return;
                    }

                    $scope.status = 'sent';
                    $scope.txid = data.txid;
                })
                .error(function (data, status, headers, config) {
                    $scope.status = 'error';
                    if (data) {
                        $scope.error = data;
                    } else {
                        $scope.error = "No error message given (connection error?)"
                    }
                });
        };
    }
);

// Source: public/src/js/services/address.js
// 'use strict';

// // TODO - remove this, no use
// angular.module('insight.address').factory('Address',
//   function($resource) {
//   return $resource(window.apiPrefix + '/addr/:addrStr/?noTxList=1', {
//     addrStr: '@addStr'
//   }, {
//     get: {
//       method: 'GET',
//       interceptor: {
//         response: function (res) {
//           return res.data;
//         },
//         responseError: function (res) {
//           if (res.status === 404) {
//             return res;
//           }
//         }
//       }
//     }
//   });
// });

 
// Source: public/src/js/services/blocks.js
// TODO: remove the first 3 blocks services
angular.module('insight.blocks')
  .factory('Block',
    function($resource) {
    return $resource(window.apiPrefix + '/block/:blockHash', {
      blockHash: '@blockHash'
    }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              return res;
            }
          }
        }
      }
    });
  })
  .factory('Blocks',
    function($resource) {
      return $resource(window.apiPrefix + '/blocks');
  })
  .factory('BlockByHeight',
    function($resource) {
      return $resource(window.apiPrefix + '/block-index/:blockHeight');
  })
  .factory('BlockService', function() {
    // return $resource(window.apiPrefix + '/block-index/:blockHeight');
    function getBlockReward(height) {
      var subsidy = new BigNumber(384 * 1e8);
    
      // Linear ramp up until 10080
      if (height < 10080) {
        subsidy /= 10080;
        subsidy *= height;
      }
    
      if (height >= 53820 && height < 96408) {
        subsidy /= 2;
      }
      if (height >= 96480 && height < 139680) {
        subsidy /= 4;
      }
      if (height >= 139680 && height < 182880) {
        subsidy /= 8;
      }
      if (height >= 182880 && height < 1278000) {
        subsidy /= 16;
      }
      if (height >= 1278000 && height < 2329920) {
        subsidy /= 32;
      }
      if (height >= 2329920 && height < 3381840){
        subsidy /= 64;
      }
      if (height >= 3381840 && height < 4433760){
        subsidy /= 128;
      }
      if (height >= 4433760 && height < 5485680){
        subsidy /= 256;
      }
      if (height >= 5485680 && height < 6537600){
        subsidy /= 512;
      }
      if (height >= 6537600 && height < 7589520){
        subsidy /= 1024;
      }
      if (height >= 7589520  && height < 8641440){
        subsidy /= 2048;
      }
      // that will be in about 15 years
      if (height >= 8641440) {
        subsidy = 0;
      }
    
      return parseInt(subsidy.toString())  / 1e8;
    };
    return {
      getBlockReward: function(height) {
        return getBlockReward(height);
      }
    }
  });

// Source: public/src/js/services/charts.js
angular.module('insight.charts')
  .factory('Chart',
    function($resource) {
    return $resource(window.apiPrefix + '/chart/:chartType', {
      chartType: '@chartType'
    }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              return res;
            }
          }
        }
      }
    });
  })
  .factory('Charts',
    function($resource) {
      return $resource(window.apiPrefix + '/charts');
  });

// Source: public/src/js/services/coinpaprika.js
angular.module('insight.coinpaprika')
  .factory('CoinPaprika', function ($http, $q) {
    function createRequest(endpoint, method) {
      const url = 'https://corsproxy.io/?' + encodeURIComponent(coinPaprikaBaseUri + endpoint);
      return {
        method: method,
        url: url
      }
    }

    function sendRequest(payload) {
      var deferred = $q.defer();
      $http(payload)
      .then(function successCallback(response) {
        deferred.resolve(response.data);
      }, function errorCallback(response) {
        deferred.reject({ status: response.status, data: response.data });
      });
      
      return deferred.promise;
    };

    function getVerusCoinMarket() {
      return sendRequest(createRequest("/coins/vrsc-verus-coin/markets", "GET"));
    };

    return {
      getVerusCoinMarket: function() {
        return getVerusCoinMarket();
      }
    };
});
// Source: public/src/js/services/currency.js
// 'use strict';

// angular.module('insight.currency').factory('Currency',
//   function($resource) {
//     return $resource(window.apiPrefix + '/currency');
// });

// Source: public/src/js/services/global.js
//Global service for global variables
angular.module('insight.system')
  .factory('Global',[
    function() {
      return {};
    }
  ])
  .factory('Version',
    function($resource) {
      return $resource(window.apiPrefix + '/version');
  })
  .service('UnitConversionService', function() {
    this.convert = function(value, unitSuffix) {
      const units = ['-', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
      var unitIndex = 0;
  
      while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000;
        unitIndex++;
      }
  
      return value.toFixed(5) + ' ' + units[unitIndex] + unitSuffix;
    }

    this.shortenString = function(text, maxLength) {
        if (text.length <= maxLength) return text;

        var halfLength = Math.floor((maxLength - 3) / 2); // Length of the ellipsis in the middle
        return text.substring(0, halfLength) + '...' + text.substring(text.length - halfLength);
    }
  })
  .service('ScrollService', function($window, $timeout) {
    this.scrollToTop = function() {
      var currentY = $window.pageYOffset;
      var step = Math.abs(currentY / 25);
      
      function scrollStep() {
        if ($window.pageYOffset > 0) {
          $window.scrollTo(0, $window.pageYOffset - step);
          requestAnimationFrame(scrollStep);
        }
      }
      requestAnimationFrame(scrollStep);
    };

    this.scrollToBottom = function() {
      $timeout(function() {
        var element = document.getElementById('footer');
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    };
  });

// Source: public/src/js/services/localstore.js
// Todo add caching to avoid reloading of large resource
angular
.module('insight.localstore')
.service('LocalStore',
    function () {
        this.set = function(key, value, ttlInSeconds) {
            var ttl = new Date();
            ttl.setSeconds(ttl.getSeconds() + ttlInSeconds);
            localStorage.setItem(key, JSON.stringify({ data: value, createdAt: new Date(), ttl: ttl}));
        }
        
        this.get = function(key) {
            const cache = JSON.parse(localStorage.getItem(key));
            if(cache != undefined && !this.isExpired(cache)) {
                return cache.data;
            }

            return undefined;
        }

        this.isExpired = function(cache) {
            const ttl = cache.ttl;

            return cache != undefined &&
            Math.floor((new Date() - new Date(cache.createdAt)) / 1000) < ttl;
        }
});
// Source: public/src/js/services/socket.js
var ScopedSocket = function(socket, $rootScope) {
  this.socket = socket;
  this.$rootScope = $rootScope;
  this.listeners = [];
};

ScopedSocket.prototype.removeAllListeners = function(opts) {
  if (!opts) opts = {};
  for (var i = 0; i < this.listeners.length; i++) {
    var details = this.listeners[i];
    if (opts.skipConnect && details.event === 'connect') {
      continue;
    }
    this.socket.removeListener(details.event, details.fn);
  }
  this.listeners = [];
};

ScopedSocket.prototype.on = function(event, callback) {
  var socket = this.socket;
  var $rootScope = this.$rootScope;

  var wrapped_callback = function() {
    var args = arguments;
    $rootScope.$apply(function() {
      callback.apply(socket, args);
    });
  };
  socket.on(event, wrapped_callback);

  this.listeners.push({
    event: event,
    fn: wrapped_callback
  });
};

ScopedSocket.prototype.emit = function(event, data, callback) {
  var socket = this.socket;
  var $rootScope = this.$rootScope;
  var args = Array.prototype.slice.call(arguments);

  args.push(function() {
    var args = arguments;
    $rootScope.$apply(function() {
      if (callback) {
        callback.apply(socket, args);
      }
    });
  });

  socket.emit.apply(socket, args);
};

angular.module('insight.socket').factory('getSocket',
  function($rootScope) {
    var socket = io.connect(null, {
      'reconnect': true,
      'reconnection delay': 500,
    });
    return function(scope) {
      var scopedSocket = new ScopedSocket(socket, $rootScope);
      scope.$on('$destroy', function() {
        scopedSocket.removeAllListeners();
      });
      socket.on('connect', function() {
        scopedSocket.removeAllListeners({
          skipConnect: true
        });
      });
      return scopedSocket;
    };
  });

// Source: public/src/js/services/status.js
// 'use strict';
// // TODO : remove this
// angular.module('insight.status')
//   .factory('Status',
//     function($resource) {
//       return $resource(window.apiPrefix + '/status', {
//         q: '@q'
//       });
//     })
//   .factory('Sync',
//     function($resource) {
//       return $resource(window.apiPrefix + '/sync');
//     })
//   .factory('PeerSync',
//     function($resource) {
//       return $resource(window.apiPrefix + '/peer');
//     });

// Source: public/src/js/services/transactions.js
// TODO - remove this, no use
angular.module('insight.transactions')
  .factory('Transaction',
    function($resource) {
    return $resource(window.apiPrefix + '/tx/:txId', {
      txId: '@txId'
    }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              return res;
            }
          }
        }
      }
    });
  })
  .factory('TransactionsByBlock',
    function($resource) {
    return $resource(window.apiPrefix + '/txs', {
      block: '@block'
    });
  })
  .factory('TransactionsByAddress',
    function($resource) {
    return $resource(window.apiPrefix + '/txs', {
      address: '@address'
    });
  })
  .factory('Transactions',
    function($resource) {
      return $resource(window.apiPrefix + '/txs');
  });

// Source: public/src/js/services/verusdrpc.js
// 'use strict';

// // Todo add caching to avoid reloading of large resource
// angular.module('insight.verusdrpc')
//   .factory('VerusdRPC', function ($http, $q) {
//     function createPayload(method, params) {
//       return {
//         method: "POST",
//         url: apiServer,
//         data: {"jsonrpc": "1.0", "id":"curltest", "method": method, "params": params},
//         headers: {
//           'Content-Type': 'application/json',
//           "Authorization": apiToken,
//           // Remove this for local api, use the authorization value instead
//           'x-api-key': '12345'
//         }
//       }
//     }

//     function sendRequest(payload) {
//       var deferred = $q.defer();
      
//       $http(payload)
//       .then(function successCallback(response) {
//         deferred.resolve(response.data);
//       }, function errorCallback(response) {
//         deferred.reject({ status: response.status, data: response.data });
//       });
      
//       return deferred.promise;
//     };

//     function getInfo() {
//       return sendRequest(createPayload("getinfo", []));
//     };
    
//     function getMiningInfo() {
//       return sendRequest(createPayload("getmininginfo", []));
//     };
    
//     function getCoinSupply() {
//       return sendRequest(createPayload("coinsupply", []));
//     };

//     function getRawTransaction(txId) {
//       return sendRequest(createPayload("getrawtransaction", [txId, 1]));
//     };
    
//     function getBlockDetail(heightOrTx) {
//       return sendRequest(createPayload("getblock", [heightOrTx]));
//     };
    
//     function getBlockDetailByTx(tx) {
//       return getBlockDetail(tx);
//     };
    
//     function getBlockDetailByHeight(height) {
//       return getBlockDetail(height);
//     };

//     function getBlockCount() {
//       // const saveCachedData = localStorage.getItem('_cacheGetBlockCount') || null;
//       // var isExpired = true;
//       // if(saveCachedData) {
//       //   const createdTime = new Date(saveCachedData.created).getTime();
//       //   const differenceMs = (new Date().getTime()) - createdTime;

//       //   isExpired = differenceMs > (1000 * 60);
//       // }

//       // if(!isExpired) {
//       //   return saveCachedData.data;
//       // }

//       // console.log("Getting new blockdata >>");
//       // const data = sendRequest(createPayload("getblockcount", []));
//       // localStorage.setItem('_cacheGetBlockCount', { data: data, created: Date.now() });
//       // return data;
//       return sendRequest(createPayload("getblockcount", []));
//     };
    
//     function getIdentity(params) {
//       return sendRequest(createPayload("getidentity", params));
//     };
    
//     function getAddressTxIds(addresses) {
//       return sendRequest(createPayload("getaddresstxids", [{"addresses": addresses}]));
//     };
//     function getAddressBalance(addresses) {
//       return sendRequest(createPayload("getaddressbalance", [{"addresses": addresses}]));
//     };
//     function getBlockHashes(startDatetime, endDatetime) {
//       return sendRequest(createPayload("getblockhashes", [startDatetime, endDatetime]));
//     };

//     return {
//       getInfo: function() {
//         return getInfo();
//       },
//       getMiningInfo: function() {
//         return getMiningInfo();
//       },
//       getCoinSupply: function() {
//         return getCoinSupply();
//       },
//       getRawTransaction: function(txId) {
//         return getRawTransaction(txId);
//       },
//       getBlockDetail: function(heightOrTx) {
//         return getBlockDetail(heightOrTx);
//       },
//       getBlockDetailByTx: function(tx) {
//         return getBlockDetailByTx(tx);
//       },
//       getBlockDetailByHeight: function(height) {
//         return getBlockDetailByHeight(height);
//       },
//       getBlockCount: function() {
//         return getBlockCount();
//       },
//       getIdentity: function(params) {
//         return getIdentity(params);
//       },
//       getAddressTxIds: function(addresses) {
//         return getAddressTxIds(addresses);
//       },
//       getAddressBalance: function(addresses) {
//         return getAddressBalance(addresses);
//       },
//       getBlockHashes: function(startDatetime, endDatetime) {
//         return getBlockHashes(startDatetime, endDatetime);
//       },
//     };
// });
// Source: public/src/js/services/verusexplorerapi.js
// Todo add caching to avoid reloading of large resource
angular.module('insight.verusexplorerapi')
  .factory('VerusExplorerApi',
  function (
    $http,
    $q
  ) {

    // const cacheKeys = localStore.api;

    function createPayload(endpoint, params, method) {
      const requestMethod = method == undefined? "POST": method;
      return {
        method: requestMethod,
        url: apiServer + endpoint,
        data: {"params": params},
        headers: {
          'Content-Type': 'application/json',
          // "Authorization": apiToken,
          // Remove this for local api, use the authorization value instead
          'x-api-key': '12345'
        }
      }
    }

    function sendRequest(payload) {
      var deferred = $q.defer();
      
      $http(payload)
      .then(function successCallback(response) {
        deferred.resolve(response.data);
      }, function errorCallback(response) {
        deferred.reject({ status: response.status, data: response.data });
      });
      
      return deferred.promise;
    };

    function getGeneratedBlocks(heightOrTxArray) {
      return sendRequest(createPayload('/api/blocks/generated', heightOrTxArray));
    };
    
    function getBlockHashesByRange(start, end) {
      return sendRequest(createPayload('/api/block/hashes', [start, end]));
    };
    
    function getBlockInfo(blockHeightOrHash) {
      return sendRequest(createPayload("/api/block/" + blockHeightOrHash + "/info", [], "GET"));
    };
    
    function getBlockchainStatus() {
      return sendRequest(createPayload('/api/blockchain/status', [], "GET"));
    };
    
    function getBlockchainHeight() {
      return sendRequest(createPayload('/api/blockchain/height', [], "GET"));
    };

    function getBlockchainInfo() {
      return sendRequest(createPayload('/api/blockchain/info', [], "GET"));
    };
    
    function getMiningInfo() {
      return sendRequest(createPayload('/api/blockchain/mining/info', [], "GET"));
    };
    
    function getTransactionInfo(txHash) {
      return sendRequest(createPayload('/api/transaction/'+txHash+'/info', [], "GET"));
    };

    function getIdentity(identityName, height) {
      var h = (height == undefined)? '' : '?height='+height;
      return sendRequest(createPayload('/api/identity/'+identityName+'/info' + h, [], 'GET'));
    };
    
    function getAddressTxIds(address) {
      return sendRequest(createPayload('/api/address/'+address+'/txids', [], "GET"));
    };
    
    function getAddressBalance(address) {
      return sendRequest(createPayload('/api/address/'+address+'/balance', [], "GET"));
    };

    function getChartData(range) {
      const ranges = ["last10Minutes","last30Minutes","lastHour","last3Hours","last6Hours","last12Hours","last24Hours"];
      if(!ranges.includes(range)) { return Promise.resolve(undefined); }
      return sendRequest(createPayload('/api/chart/?range='+range, [], "GET"));
    };

    function search(query) {
      return sendRequest(createPayload('/api/search/?q='+query, [], "GET"));
    };

    return {
      getGeneratedBlocks: function(heightOrTxArray) {
        return getGeneratedBlocks(heightOrTxArray);
      },
      getBlockHashesByRange: function(start, end) {
        return getBlockHashesByRange(start, end);
      },
      getBlockInfo: function(blockHeightOrHash) {
        return getBlockInfo(blockHeightOrHash);
      },
      getBlockchainStatus: function() {
        return getBlockchainStatus();
      },
      getBlockchainInfo: function() {
        return getBlockchainInfo();
      },
      getMiningInfo: function() {
        return getMiningInfo();
      },
      getBlockchainHeight: function() {
        return getBlockchainHeight();
      },
      getTransactionInfo: function(txHash) {
        return getTransactionInfo(txHash);
      },
      getIdentity: function(identityName, height) {
        return getIdentity(identityName, height);
      },
      getAddressTxIds: function(address) {
        return getAddressTxIds(address);
      },
      getAddressBalance: function(address) {
        return getAddressBalance(address);
      },
      getChartData: function(range) {
        return getChartData(range);
      },
      search: function(query) {
        return search(query);
      },
    };
});
// Source: public/src/js/services/veruswssclient.js
angular
.module('insight.veruswssclient')
.service('VerusWssClient',
    function(
        $interval,
        $rootScope
    ) {
        var lastReceivedTime = new Date().getTime();
        var wsChannelObject = connectToWsServer();
        const wsMessageTopic = 'wsmessage';

        this.getMessageTopic = function() {
            return wsMessageTopic;
        }

        $interval(function() {
            if(wsChannelObject.readyState !== WebSocket.OPEN) {
                
                removeEventListeners();

                console.log('Closing the current connection ...');
                wsChannelObject.close();
                
                console.log('Opening a new one ...');
                wsChannelObject = connectToWsServer();
                return;
            }

            // If last received is less than 30 seconds, don't ping
            if(getLastReceivedInSeconds() > 30) {
                console.log("pinging server")
                wsChannelObject.send("ping from client");
                return;
            }

            console.log("will send ping later to save bandwidth...");
        }, 30000);

        function getLastReceivedInSeconds() {
            const currentTime = new Date().getTime();
            const elapsedTimeInSeconds = (currentTime - lastReceivedTime) / 1000;
            console.log("Last data received : " + elapsedTimeInSeconds + ' seconds ago');
            return elapsedTimeInSeconds;
        }

        function removeEventListeners() {
            if(wsChannelObject == undefined) { return; }
            console.log('Removing event listeners...');
            wsChannelObject.removeEventListener('message', messageEventListener);
            wsChannelObject.removeEventListener('open', openEventListener);
            wsChannelObject.removeEventListener('ping', pingEventListener);
        }

        function messageEventListener (event) {
            lastReceivedTime = new Date().getTime();
            // console.log('Message from server:', event.data);
            var data = event.data.toString();
            console.log(data);
            data = JSON.parse(data);
            if(data.status != undefined) { $rootScope.$broadcast(wsMessageTopic, data); }
        };
        
        function openEventListener (event) {
            console.log('Connected to WebSocket server');
        };
        
        function pingEventListener (event) {
            console.log('Server is pinging us.');
        };

        function connectToWsServer() {
            // const socket = new WebSocket('wss://wip-ws-insight.pangz.tech/verus/wss');
            // const socket = new WebSocket('ws://localhost:2220');
            const socket = new WebSocket(wsServer);
            
            socket.addEventListener('open', openEventListener);
            socket.addEventListener('ping', pingEventListener);
            socket.addEventListener('message', messageEventListener);
            socket.addEventListener('close', function close() {
                console.log('>> WebSocket service connection closed ...');
            });

            return socket;
        }
});

// Source: public/src/js/services/wseventdatamanager.js
// Todo add caching to avoid reloading of large resource
angular
.module('insight.wseventdatamanager')
.service('WsEventDataManager',
    function (LocalStore) {
    var collectedBlocks = [];
    var collectedTxs = [];

    var resultBlocks = [];
    var resultTxs = [];
    const MAX_BLOCKS_COUNT = 5;
    const MAX_TX_COUNT = 30;

    const CACHE_KEY_BLOCKS = localStore.latestBlocks.key;
    const CACHE_TTL_BLOCK = localStore.latestBlocks.ttl;
      
    const CACHE_KEY_TXS = localStore.latestBlockTxs.key;
    const CACHE_TTL_TXS = localStore.latestBlockTxs.ttl;

    const CACHE_KEY_STATUS = localStore.status.key;
    const CACHE_TTL_STATUS = localStore.status.ttl;

    const CACHE_KEY_NODE_STATE = localStore.nodeState.key;
    const CACHE_TTL_NODE_STATE = localStore.nodeState.ttl;

    this.saveToCache = function(data, key, ttl) {
        LocalStore.set(key, data, ttl);
    }

    this.updateBlocksScopeData = function(data, isCachedData) {
        var currentSize = collectedBlocks.length;
        for(var i = 0; i < data.length; i++) {
            const d = data[i];
            if(collectedBlocks.includes(d.height)) { continue; }
            
            collectedBlocks.push(d.height);
            resultBlocks.unshift({
                height: d.height,
                hash: d.hash,
                txlength: !isCachedData? d.txs.length: d.txlength,
                time: new Date(d.time),
                txs: d.txs
            });
            currentSize += 1;
            if(resultBlocks[MAX_BLOCKS_COUNT] != undefined) {
                console.log("before BLOCK POP");
                console.log(resultBlocks);
                resultBlocks.pop();
            }
        }
        this.saveToCache(resultBlocks, CACHE_KEY_BLOCKS, CACHE_TTL_BLOCK);

        return resultBlocks;
    }
    
    this.updateTxHashScopeData = function(txsData, isCachedData) {
        for(var i = 0; i < txsData.length; i++) {
            const data = txsData[i];
            if(collectedTxs.includes(data.txid)) { continue;}

            const txid = data.txid;
            const height = data.height;
            const time = data.time;
            var totalVout = 0;
            
            if(isCachedData) {
                totalVout = data.valueOut;
            } else {
                index = collectedTxs.length;
                for(var i = 0; i < data.vout.length; i++) {
                    totalVout += data.vout[i].value;
                }
            }
            
            collectedTxs.push(txid);
            resultTxs.unshift({
                txid: txid,
                valueOut: totalVout,
                height: height,
                time: time,
            });

            if(resultTxs[MAX_TX_COUNT] != undefined) {
                console.log("before POP");
                console.log(resultTxs);
                resultTxs.pop();
            }
        }
        this.saveToCache(resultTxs, CACHE_KEY_TXS, CACHE_TTL_TXS);
        return resultTxs;
    }

    this.updateStatusScopeData = function(data) {
        // $scope.info = data;
        this.saveToCache(data, CACHE_KEY_STATUS, CACHE_TTL_STATUS);
        return data;
    }

    this.updateChainNodeStateScopeData = function(data) {
        const chainNodeState = data;
        var sync = data;
        sync.error = data == undefined;
        this.saveToCache(chainNodeState, CACHE_KEY_NODE_STATE, CACHE_TTL_NODE_STATE);
        return {
            sync: sync,
            chainNodeState: chainNodeState
        }
    }
});
// Source: public/src/js/directives.js
// var ZeroClipboard = window.ZeroClipboard;

angular.module('insight')
  .directive('scroll', function ($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind('scroll', function() {
        if (this.pageYOffset >= 200) {
          scope.secondaryNavbar = true;
        } else {
          scope.secondaryNavbar = false;
        }
        scope.$apply();
      });
    };
  })
  .directive('whenScrolled', function($window) {
    return {
      restric: 'A',
      link: function(scope, elm, attr) {
        var pageHeight, clientHeight, scrollPos;
        $window = angular.element($window);

        var handler = function() {
          pageHeight = window.document.documentElement.scrollHeight;
          clientHeight = window.document.documentElement.clientHeight;
          scrollPos = window.pageYOffset;

          if (pageHeight - (scrollPos + clientHeight) === 0) {
            scope.$apply(attr.whenScrolled);
          }
        };

        $window.on('scroll', handler);

        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
      }
    };
  }).directive('copyToClipboard', function() {
    return {
        restrict: 'A',
        // template: '<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
        link: function(scope, element, attrs) {
            // element.attr('uib-tooltip', 'Click to copy'); // Set tooltip text
            // element.attr('tooltip-trigger', 'mouseenter'); // Show tooltip on mouse enter
            // element.attr('tooltip-placement', 'top'); // Set tooltip placement
            // element.tooltip();
            element.on('click', function() {
                // this.tooltip('toggle');
                var textToCopy = attrs.copyToClipboard;
                // var attachedElement = angular.element('<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>');
                // // Append the attachedElement to the body
                // this.re append(attachedElement);
                
                // // Compile the attachedElement to apply AngularJS bindings
                // $compile(attachedElement)(scope);
            
                navigator.clipboard.writeText(textToCopy)
                    .then(function() {
                      alert(textToCopy + ' copied!');
                    })
                    .catch(function(error) { console.error('Unable to copy text to clipboard: ', error);});
            });
        }
    };
})
  // .directive('clipCopy', function() {
  //   ZeroClipboard.config({
  //     moviePath: '/lib/zeroclipboard/ZeroClipboard.swf',
  //     trustedDomains: ['*'],
  //     allowScriptAccess: 'always',
  //     forceHandCursor: true
  //   });

  //   return {
  //     restric: 'A',
  //     scope: { clipCopy: '=clipCopy' },
  //     template: '<div class="tooltip fade right in"><div class="tooltip-arrow"></div><div class="tooltip-inner">Copied!</div></div>',
  //     link: function(scope, elm) {
  //       var clip = new ZeroClipboard(elm);

  //       clip.on('load', function(client) {
  //         var onMousedown = function(client) {
  //           client.setText(scope.clipCopy);
  //         };

  //         client.on('mousedown', onMousedown);

  //         scope.$on('$destroy', function() {
  //           client.off('mousedown', onMousedown);
  //         });
  //       });

  //       clip.on('noFlash wrongflash', function() {
  //         return elm.remove();
  //       });
  //     }
  //   };
  // })
  .directive('focus', function ($timeout) {
    return {
      scope: {
        trigger: '@focus'
      },
      link: function (scope, element) {
        scope.$watch('trigger', function (value) {
          if (value === "true") {
            $timeout(function () {
              element[0].focus();
            });
          }
        });
      }
    };
  });

// Source: public/src/js/filters.js
angular.module('insight')
  .filter('startFrom', function() {
    return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  })
  .filter('split', function() {
    return function(input, delimiter) {
      var delimiter = delimiter || ',';
      return input.split(delimiter);
    }
  });

// Source: public/src/js/config.js
//Setting up route
angular.module('insight').config(function($routeProvider) {
  $routeProvider.
    when('/block/:blockHash', {
      templateUrl: 'views/block.html',
      title: 'Verus Block '
    }).
    // when('/block-index/:blockHeight', {
    //   controller: 'BlocksController',
    //   templateUrl: 'views/redirect.html'
    // }).
    when('/tx/send', {
      templateUrl: 'views/transaction_sendraw.html',
      title: 'Broadcast Raw Transaction'
    }).
    when('/tx/:txId/:v_type?/:v_index?', {
      templateUrl: 'views/transaction.html',
      title: 'Verus Transaction '
    }).
    when('/', {
      templateUrl: 'views/index.html',
      title: 'Home'
    }).
    when('/blocks', {
      templateUrl: 'views/block_list.html',
      title: 'Blocks'
    }).
    when('/blocks-date/:blockDate/:startTimestamp?', {
      templateUrl: 'views/block_list.html',
      title: 'Blocks ' // trailing space in string!
    }).
    when('/address/:addrStr', {
      templateUrl: 'views/address.html',
      title: 'Verus Address '
    }).
    when('/charts/:chartType?', {
      templateUrl: 'views/charts.html',
      title: 'Charts'
    }).
    when('/status', {
      templateUrl: 'views/status.html',
      title: 'Status'
    }).
    when('/messages/verify', {
      templateUrl: 'views/messages_verify.html',
      title: 'Verify Message'
    }).
    when('/help', {
      templateUrl: 'views/help.html',
      title: 'Status'
    })
    .otherwise({
      templateUrl: 'views/404.html',
      title: 'Error'
    });
});

//Setting HTML5 Location Mode
angular.module('insight')
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  })
  .run(function($rootScope, $route, $location, $routeParams, $anchorScroll, ngProgress, gettextCatalog, amMoment) {
    gettextCatalog.currentLanguage = defaultLanguage;
    amMoment.changeLocale(defaultLanguage);
    $rootScope.$on('$routeChangeStart', function() {
      ngProgress.start();
    });

    $rootScope.$on('$routeChangeSuccess', function() {
      ngProgress.complete();

      //Change page title, based on Route information
      $rootScope.titleDetail = '';
      $rootScope.title = $route.current.title;
      $rootScope.isCollapsed = true;
      $rootScope.currentAddr = null;

      $location.hash($routeParams.scrollTo);
      $anchorScroll();
    });
  });

// Source: public/src/js/init.js
angular.element(document).ready(function() {
  // Init the app
  // angular.bootstrap(document, ['insight']);
});

// Source: public/src/js/translations.js
angular.module('insight').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('de_DE', {"(Input unconfirmed)":"(Eingabe unbestätigt)","404 Page not found :(":"404 Seite nicht gefunden :(","<strong>insight</strong>  is an <a href=\"http://live.insight.is/\" target=\"_blank\">open-source Verus blockchain explorer</a> with complete REST and websocket APIs that can be used for writing web wallets and other apps  that need more advanced blockchain queries than provided by verusd RPC.  Check out the <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">source code</a>.":"<strong>insight</strong> ist ein <a href=\"http://live.insight.is/\" target=\"_blank\">Open Source Verus Blockchain Explorer</a> mit vollständigen REST und Websocket APIs um eigene Wallets oder Applikationen zu implementieren. Hierbei werden fortschrittlichere Abfragen der Blockchain ermöglicht, bei denen die RPC des verusd nicht mehr ausreichen. Der aktuelle <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">Quellcode</a> ist auf Github zu finden.","<strong>insight</strong> is still in development, so be sure to report any bugs and provide feedback for improvement at our <a href=\"https://github.com/bitpay/insight/issues\" target=\"_blank\">github issue tracker</a>.":"<strong>insight</strong> befindet sich aktuell noch in der Entwicklung. Bitte sende alle gefundenen Fehler (Bugs) und Feedback zur weiteren Verbesserung an unseren <a href=\"https://github.com/BloodyNora/insight-ui-komodo/issues\" target=\"_blank\">Github Issue Tracker</a>.","About":"Über insight","Address":"Adresse","Age":"Alter","Application Status":"Programmstatus","Best Block":"Bester Block","Verus node information":"Verus-Node Info","Block":"Block","Block Reward":"Belohnung","Blocks":"Blöcke","Bytes Serialized":"Serialisierte Bytes","Can't connect to verusd to get live updates from the p2p network. (Tried connecting to verusd at {{host}}:{{port}} and failed.)":"Es ist nicht möglich mit verusd zu verbinden um live Aktualisierungen vom P2P Netzwerk zu erhalten. (Verbindungsversuch zu verusd an {{host}}:{{port}} ist fehlgeschlagen.)","Can't connect to insight server. Attempting to reconnect...":"Keine Verbindung zum insight-Server möglich. Es wird versucht die Verbindung neu aufzubauen...","Can't connect to internet. Please, check your connection.":"Keine Verbindung zum Internet möglich, bitte Zugangsdaten prüfen.","Complete":"Vollständig","Confirmations":"Bestätigungen","Conn":"Verb.","Connections to other nodes":"Verbindungen zu Nodes","Current Blockchain Tip (insight)":"Aktueller Blockchain Tip (insight)","Current Sync Status":"Aktueller Status","Details":"Details","Difficulty":"Schwierigkeit","Double spent attempt detected. From tx:":"Es wurde ein \"double Spend\" Versuch erkannt.Von tx:","Error!":"Fehler!","Fee":"Gebühr","Final Balance":"Schlussbilanz","Finish Date":"Fertigstellung","Go to home":"Zur Startseite","Hash Serialized":"Hash Serialisiert","Height":"Höhe","Included in Block":"Eingefügt in Block","Incoherence in levelDB detected:":"Es wurde eine Zusammenhangslosigkeit in der LevelDB festgestellt:","Info Errors":"Fehlerbeschreibung","Initial Block Chain Height":"Ursprüngliche Blockchain Höhe","Input":"Eingänge","Last Block":"Letzter Block","Last Block Hash (Verus)":"Letzter Hash (Verus)","Latest Blocks":"Letzte Blöcke","Latest Transactions":"Letzte Transaktionen","Loading Address Information":"Lade Adressinformationen","Loading Block Information":"Lade Blockinformation","Loading Selected Date...":"Lade gewähltes Datum...","Loading Transaction Details":"Lade Transaktionsdetails","Loading Transactions...":"Lade Transaktionen...","Loading...":"Lade...","Mined Time":"Block gefunden (Mining)","Mined by":"Gefunden von","Mining Difficulty":"Schwierigkeitgrad","Next Block":"Nächster Block","No Inputs (Newly Generated Coins)":"Keine Eingänge (Neu generierte Coins)","No blocks yet.":"Keine Blöcke bisher.","No matching records found!":"Keine passenden Einträge gefunden!","No. Transactions":"Anzahl Transaktionen","Number Of Transactions":"Anzahl der Transaktionen","Output":"Ausgänge","Powered by":"Powered by","Previous Block":"Letzter Block","Protocol Version":"Protokollversion","Proxy setting":"Proxyeinstellung","Received Time":"Eingangszeitpunkt","Redirecting...":"Umleitung...","Search for block, transaction, address or Verus ID":"Suche Block, Transaktion, Adresse oder Verus ID","See all blocks":"Alle Blöcke anzeigen","Show Transaction Output data":"Zeige Abgänge","Show all":"Zeige Alles","Show input":"Zeige Eingänge","Show less":"Weniger anzeigen","Show more":"Mehr anzeigen","Size":"Größe","Size (bytes)":"Größe (bytes)","Skipped Blocks (previously synced)":"Verworfene Blöcke (bereits syncronisiert)","Start Date":"Startdatum","Status":"Status","Summary":"Zusammenfassung","Summary <small>confirmed</small>":"Zusammenfassung <small>bestätigt</small>","Sync Progress":"Fortschritt","Sync Status":"Syncronisation","Sync Type":"Art der Syncronisation","Synced Blocks":"Syncronisierte Blöcke","Testnet":"Testnet aktiv","There are no transactions involving this address.":"Es gibt keine Transaktionen zu dieser Adressse","Time Offset":"Zeitoffset zu UTC","Timestamp":"Zeitstempel","Today":"Heute","Total Amount":"Gesamtsumme","Total Received":"Insgesamt empfangen","Total Sent":"Insgesamt gesendet","Transaction":"Transaktion","Transaction Output Set Information":"Transaktions Abgänge","Transaction Outputs":"Abgänge","Transactions":"Transaktionen","Type":"Typ","Unconfirmed":"Unbestätigt","Unconfirmed Transaction!":"Unbestätigte Transaktion!","Unconfirmed Txs Balance":"Unbestätigtes Guthaben","Value Out":"Wert","Version":"Version","Waiting for blocks...":"Warte auf Blöcke...","Waiting for transactions...":"Warte auf Transaktionen...","by date.":"nach Datum.","first seen at":"zuerst gesehen am","mined":"gefunden","mined on:":"vom:","Waiting for blocks":"Warte auf Blöcke"});
    gettextCatalog.setStrings('es', {"(Input unconfirmed)":"(Entrada sin confirmar)","404 Page not found :(":"404 Página no encontrada :(","<strong>insight</strong>  is an <a href=\"http://live.insight.is/\" target=\"_blank\">open-source Verus blockchain explorer</a> with complete REST and websocket APIs that can be used for writing web wallets and other apps  that need more advanced blockchain queries than provided by verusd RPC.  Check out the <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">source code</a>.":"<strong>insight</strong>  es un <a href=\"http://live.insight.is/\" target=\"_blank\">explorador de bloques de Verus open-source</a> con un completo conjunto de REST y APIs de websockets que pueden ser usadas para escribir monederos de Verus y otras aplicaciones que requieran consultar un explorador de bloques.  Obtén el código en <a href=\"http://github.com/bitpay/insight\" target=\"_blank\">el repositorio abierto de Github</a>.","<strong>insight</strong> is still in development, so be sure to report any bugs and provide feedback for improvement at our <a href=\"https://github.com/bitpay/insight/issues\" target=\"_blank\">github issue tracker</a>.":"<strong>insight</strong> esta en desarrollo aún, por ello agradecemos que nos reporten errores o sugerencias para mejorar el software. <a href=\"https://github.com/BloodyNora/insight-ui-komodo/issues\" target=\"_blank\">Github issue tracker</a>.","About":"Acerca de","Address":"Dirección","Age":"Edad","Application Status":"Estado de la Aplicación","Best Block":"Mejor Bloque","Verus node information":"Información del nodo Verus","Block":"Bloque","Block Reward":"Bloque Recompensa","Blocks":"Bloques","Bytes Serialized":"Bytes Serializados","Can't connect to verusd to get live updates from the p2p network. (Tried connecting to verusd at {{host}}:{{port}} and failed.)":"No se pudo conectar a verusd para obtener actualizaciones en vivo de la red p2p. (Se intentó conectar a verusd de {{host}}:{{port}} y falló.)","Can't connect to insight server. Attempting to reconnect...":"No se pudo conectar al servidor insight. Intentando re-conectar...","Can't connect to internet. Please, check your connection.":"No se pudo conectar a Internet. Por favor, verifique su conexión.","Complete":"Completado","Confirmations":"Confirmaciones","Conn":"Con","Connections to other nodes":"Conexiones a otros nodos","Current Blockchain Tip (insight)":"Actual Blockchain Tip (insight)","Current Sync Status":"Actual Estado de Sincronización","Details":"Detalles","Difficulty":"Dificultad","Double spent attempt detected. From tx:":"Intento de doble gasto detectado. De la transacción:","Error!":"¡Error!","Fee":"Tasa","Final Balance":"Balance Final","Finish Date":"Fecha Final","Go to home":"Volver al Inicio","Hash Serialized":"Hash Serializado","Height":"Altura","Included in Block":"Incluido en el Bloque","Incoherence in levelDB detected:":"Detectada una incoherencia en levelDB:","Info Errors":"Errores de Información","Initial Block Chain Height":"Altura de la Cadena en Bloque Inicial","Input":"Entrada","Last Block":"Último Bloque","Last Block Hash (Verus)":"Último Bloque Hash (Verus)","Latest Blocks":"Últimos Bloques","Latest Transactions":"Últimas Transacciones","Loading Address Information":"Cargando Información de la Dirección","Loading Block Information":"Cargando Información del Bloque","Loading Selected Date...":"Cargando Fecha Seleccionada...","Loading Transaction Details":"Cargando Detalles de la Transacción","Loading Transactions...":"Cargando Transacciones...","Loading...":"Cargando...","Mined Time":"Hora de Minado","Mined by":"Minado por","Mining Difficulty":"Dificultad de Minado","Next Block":"Próximo Bloque","No Inputs (Newly Generated Coins)":"Sin Entradas (Monedas Recién Generadas)","No blocks yet.":"No hay bloques aún.","No matching records found!":"¡No se encontraron registros coincidentes!","No. Transactions":"Nro. de Transacciones","Number Of Transactions":"Número de Transacciones","Output":"Salida","Powered by":"Funciona con","Previous Block":"Bloque Anterior","Protocol Version":"Versión del protocolo","Proxy setting":"Opción de proxy","Received Time":"Hora de Recibido","Redirecting...":"Redireccionando...","Search for block, transaction, address or Verus ID":"Buscar bloques, transacciones, direcciones o Verus ID","See all blocks":"Ver todos los bloques","Show Transaction Output data":"Mostrar dato de Salida de la Transacción","Show all":"Mostrar todos","Show input":"Mostrar entrada","Show less":"Ver menos","Show more":"Ver más","Size":"Tamaño","Size (bytes)":"Tamaño (bytes)","Skipped Blocks (previously synced)":"Bloques Saltados (previamente sincronizado)","Start Date":"Fecha de Inicio","Status":"Estado","Summary":"Resumen","Summary <small>confirmed</small>":"Resumen <small>confirmados</small>","Sync Progress":"Proceso de Sincronización","Sync Status":"Estado de Sincronización","Sync Type":"Tipo de Sincronización","Synced Blocks":"Bloques Sincornizados","Testnet":"Red de prueba","There are no transactions involving this address.":"No hay transacciones para esta dirección","Time Offset":"Desplazamiento de hora","Timestamp":"Fecha y hora","Today":"Hoy","Total Amount":"Cantidad Total","Total Received":"Total Recibido","Total Sent":"Total Enviado","Transaction":"Transacción","Transaction Output Set Information":"Información del Conjunto de Salida de la Transacción","Transaction Outputs":"Salidas de la Transacción","Transactions":"Transacciones","Type":"Tipo","Unconfirmed":"Sin confirmar","Unconfirmed Transaction!":"¡Transacción sin confirmar!","Unconfirmed Txs Balance":"Balance sin confirmar","Value Out":"Valor de Salida","Version":"Versión","Waiting for blocks...":"Esperando bloques...","Waiting for transactions...":"Esperando transacciones...","by date.":"por fecha.","first seen at":"Visto a","mined":"minado","mined on:":"minado el:","Waiting for blocks":"Esperando bloques"});
    gettextCatalog.setStrings('ja', {"(Input unconfirmed)":"(入力は未検証です)","404 Page not found :(":"404 ページがみつかりません (´・ω・`)","<strong>insight</strong>  is an <a href=\"http://live.insight.is/\" target=\"_blank\">open-source Verus blockchain explorer</a> with complete REST and websocket APIs that can be used for writing web wallets and other apps  that need more advanced blockchain queries than provided by verusd RPC.  Check out the <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">source code</a>.":"<strong>insight</strong>は、verusd RPCの提供するものよりも詳細なブロックチェインへの問い合わせを必要とするウェブウォレットやその他のアプリを書くのに使える、完全なRESTおよびwebsocket APIを備えた<a href=\"http://live.insight.is/\" target=\"_blank\">オープンソースのビットコインブロックエクスプローラ</a>です。<a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">ソースコード</a>を確認","<strong>insight</strong> is still in development, so be sure to report any bugs and provide feedback for improvement at our <a href=\"https://github.com/bitpay/insight/issues\" target=\"_blank\">github issue tracker</a>.":"<strong>insight</strong>は現在開発中です。<a href=\"https://github.com/bitpay/insight/issues\" target=\"_blank\">githubのissueトラッカ</a>にてバグの報告や改善案の提案をお願いします。","About":"はじめに","Address":"アドレス","Age":"生成後経過時間","An error occured in the verification process.":"検証過程でエラーが発生しました。","An error occured:<br>{{error}}":"エラーが発生しました:<br>{{error}}","Application Status":"アプリケーションの状態","Best Block":"最良ブロック","Verus comes with a way of signing arbitrary messages.":"Verusには任意のメッセージを署名する昨日が備わっています。","Verus node information":"Verusノード情報","Block":"ブロック","Block Reward":"ブロック報酬","Blocks":"ブロック","Broadcast Raw Transaction":"生のトランザクションを配信","Bytes Serialized":"シリアライズ後の容量 (バイト)","Can't connect to verusd to get live updates from the p2p network. (Tried connecting to verusd at {{host}}:{{port}} and failed.)":"P2Pネットワークからライブ情報を取得するためにverusdへ接続することができませんでした。({{host}}:{{port}} への接続を試みましたが、失敗しました。)","Can't connect to insight server. Attempting to reconnect...":"insight サーバに接続できません。再接続しています...","Can't connect to internet. Please, check your connection.":"インターネットに接続できません。コネクションを確認してください。","Complete":"完了","Confirmations":"検証数","Conn":"接続数","Connections to other nodes":"他ノードへの接続","Current Blockchain Tip (insight)":"現在のブロックチェインのTip (insight)","Current Sync Status":"現在の同期状況","Details":"詳細","Difficulty":"難易度","Double spent attempt detected. From tx:":"二重支払い攻撃をこのトランザクションから検知しました：","Error message:":"エラーメッセージ:","Error!":"エラー！","Fee":"手数料","Final Balance":"最終残高","Finish Date":"終了日時","Go to home":"ホームへ","Hash Serialized":"シリアライズデータのハッシュ値","Height":"ブロック高","Included in Block":"取り込まれたブロック","Incoherence in levelDB detected:":"levelDBの破損を検知しました:","Info Errors":"エラー情報","Initial Block Chain Height":"起動時のブロック高","Input":"入力","Last Block":"直前のブロック","Last Block Hash (Verus)":"直前のブロックのハッシュ値 (Verus)","Latest Blocks":"最新のブロック","Latest Transactions":"最新のトランザクション","Loading Address Information":"アドレス情報を読み込んでいます","Loading Block Information":"ブロック情報を読み込んでいます","Loading Selected Date...":"選択されたデータを読み込んでいます...","Loading Transaction Details":"トランザクションの詳細を読み込んでいます","Loading Transactions...":"トランザクションを読み込んでいます...","Loading...":"ロード中...","Message":"メッセージ","Mined Time":"採掘時刻","Mined by":"採掘者","Mining Difficulty":"採掘難易度","Next Block":"次のブロック","No Inputs (Newly Generated Coins)":"入力なし (新しく生成されたコイン)","No blocks yet.":"ブロックはありません。","No matching records found!":"一致するレコードはありません！","No. Transactions":"トランザクション数","Number Of Transactions":"トランザクション数","Output":"出力","Powered by":"Powered by","Previous Block":"前のブロック","Protocol Version":"プロトコルバージョン","Proxy setting":"プロキシ設定","Raw transaction data":"トランザクションの生データ","Raw transaction data must be a valid hexadecimal string.":"生のトランザクションデータは有効な16進数でなければいけません。","Received Time":"受信時刻","Redirecting...":"リダイレクトしています...","Search for block, transaction, address or Verus ID":"ブロック、トランザクション、アドレス, ヴェルスID を検索","See all blocks":"すべてのブロックをみる","Send transaction":"トランザクションを送信","Show Transaction Output data":"トランザクションの出力データをみる","Show all":"すべて表示","Show input":"入力を表示","Show less":"隠す","Show more":"表示する","Signature":"署名","Size":"サイズ","Size (bytes)":"サイズ (バイト)","Skipped Blocks (previously synced)":"スキップされたブロック (同期済み)","Start Date":"開始日時","Status":"ステータス","Summary":"概要","Summary <small>confirmed</small>":"サマリ <small>検証済み</small>","Sync Progress":"同期の進捗状況","Sync Status":"同期ステータス","Sync Type":"同期タイプ","Synced Blocks":"同期されたブロック数","Testnet":"テストネット","The message failed to verify.":"メッセージの検証に失敗しました。","The message is verifiably from {{verification.address}}.":"メッセージは{{verification.address}}により検証されました。","There are no transactions involving this address.":"このアドレスに対するトランザクションはありません。","This form can be used to broadcast a raw transaction in hex format over\n        the Verus network.":"このフォームでは、16進数フォーマットの生のトランザクションをVerusネットワーク上に配信することができます。","This form can be used to verify that a message comes from\n        a specific Verus address.":"このフォームでは、メッセージが特定のVerusアドレスから来たかどうかを検証することができます。","Time Offset":"時間オフセット","Timestamp":"タイムスタンプ","Today":"今日","Total Amount":"Verus総量","Total Received":"総入金額","Total Sent":"総送金額","Transaction":"トランザクション","Transaction Output Set Information":"トランザクションの出力セット情報","Transaction Outputs":"トランザクションの出力","Transaction succesfully broadcast.<br>Transaction id: {{txid}}":"トランザクションの配信に成功しました。<br>トランザクションID: {{txid}}","Transactions":"トランザクション","Type":"タイプ","Unconfirmed":"未検証","Unconfirmed Transaction!":"未検証のトランザクションです！","Unconfirmed Txs Balance":"未検証トランザクションの残高","Value Out":"出力値","Verify":"検証","Verify signed message":"署名済みメッセージを検証","Version":"バージョン","Waiting for blocks...":"ブロックを待っています...","Waiting for transactions...":"トランザクションを待っています...","by date.":"日毎。","first seen at":"最初に発見された日時","mined":"採掘された","mined on:":"採掘日時:","(Mainchain)":"(メインチェーン)","(Orphaned)":"(孤立したブロック)","Bits":"Bits","Block #{{block.height}}":"ブロック #{{block.height}}","BlockHash":"ブロックのハッシュ値","Blocks <br> mined on:":"ブロック <br> 採掘日","Coinbase":"コインベース","Hash":"ハッシュ値","LockTime":"ロック時間","Merkle Root":"Merkleルート","Nonce":"Nonce","Ooops!":"おぉっと！","Output is spent":"出力は使用済みです","Output is unspent":"出力は未使用です","Scan":"スキャン","Show/Hide items details":"アイテムの詳細を表示または隠す","Waiting for blocks":"ブロックを待っています","by date. {{detail}} {{before}}":"日時順 {{detail}} {{before}}","scriptSig":"scriptSig","{{tx.confirmations}} Confirmations":"{{tx.confirmations}} 検証","<span class=\"glyphicon glyphicon-warning-sign\"></span> (Orphaned)":"<span class=\"glyphicon glyphicon-warning-sign\"></span> (孤立したブロック)","<span class=\"glyphicon glyphicon-warning-sign\"></span> Incoherence in levelDB detected: {{vin.dbError}}":"<span class=\"glyphicon glyphicon-warning-sign\"></span> Incoherence in levelDB detected: {{vin.dbError}}","Waiting for blocks <span class=\"loader-gif\"></span>":"ブロックを待っています <span class=\"loader-gif\"></span>"});
    gettextCatalog.setStrings('ru', {"(Input unconfirmed)":"(неподтвержденный вход)","404 Page not found :(":"404 Страница не найдена :(","<strong>insight</strong>  is an <a href=\"http://live.insight.is/\" target=\"_blank\">open-source Verus blockchain explorer</a> with complete REST and websocket APIs that can be used for writing web wallets and other apps  that need more advanced blockchain queries than provided by verusd RPC.  Check out the <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">source code</a>.":"<strong>insight</strong>  is an <a href=\"http://live.insight.is/\" target=\"_blank\">open-source Verus blockchain explorer</a> with complete REST and websocket APIs that can be used for writing web wallets and other apps  that need more advanced blockchain queries than provided by verusd RPC.  Check out the <a href=\"https://github.com/BloodyNora/insight-ui-komodo\" target=\"_blank\">source code</a>.","Address":"Адрес","Age":"Время","An error occured in the verification process.":"Произошла ошибка в процессе проверки.","An error occured:<br>{{error}}":"Произошла ошибка:<br>{{error}}","Application Status":"Статус приложения","Block":"Блок","Block Reward":"Награда за блок","Blocks":"Блоки","Broadcast Raw Transaction":"Отправить raw-транзакцию в сеть","Can't connect to insight server. Attempting to reconnect...":"Ошибка подклоючения к серверу insight. Повторная попытка...","Can't connect to internet. Please, check your connection.":"Ошибка подключения к интернет. Пожалуйста, проверьте соединение.","Can't connect to verusd to get live updates from the p2p network. (Tried connecting to verusd at {{host}}:{{port}} and failed.)":"Ошибка подключения к verusd для получения обновлений из сети. (Попытка подключения к {{host}}:{{port}} не удалась.)","Charts":"Графики","Complete":"Завершено","Confirmations":"Подтверждений","Conn":"Узлы","Connections to other nodes":"Соединений с другими узлами","Current Blockchain Tip (insight)":"Текущая вершина блокчейна (insight)","Current Sync Status":"Текущий статус синхронизации","Details":"Подробная информация","Difficulty":"Сложность","Double spent attempt detected. From tx:":"Попытка двойной траты. Транзакция:","End-to-end Blockchain Solutions Provider empowering developers to build freely\nand participate in creating the largest open blockchain network.":"End-to-end Blockchain Solutions Provider empowering developers to build freely\nand participate in creating the largest open blockchain network.","Error message:":"Описание ошибки:","Error!":"Ошибка!","Fee":"Комиссия","Fee Rate":"Размер комисии","Final Balance":"Итоговый баланс","Finish Date":"Время завершения","Go to home":"Домой","Height":"Высота","Included in Block":"Входит в блок","Incoherence in levelDB detected:":"Нарушение связности в LevelDB:","Info Errors":"Информация об ошибках","Initial Block Chain Height":"Начальная высота блокчейна","Input":"Вход","Verus comes with a way of signing arbitrary messages.":"Verus comes with a way of signing arbitrary messages.","Verus node information":"Информация об узле","Last Block":"Последний блок","Last Block Hash (Verus)":"Хеш последнего блока (Verus)","Latest Blocks":"Последние блоки","Latest Transactions":"Последние транзакции","Loading Address Information":"Загрузка информации\n об адресе","Loading Block Information":"Загрузка информации о блоке","Loading Selected Date...":"Загрузка выбранной даты...","Loading Transaction Details":"Загрузка деталей транзакции","Loading Transactions...":"Загрузка транзакций...","Loading chart...":"Загрузка графиков...","Loading...":"Загрузка...","Message":"Сообщение","Mined Time":"Время получения","Mined by":"Майнер","Mining Difficulty":"Сложность майнинга","Network":"Сеть","Next Block":"Следующий блок","No Inputs":"Нет входов","No Inputs (Newly Generated Coins)":"Нет входов (coinbase транзакция)","No JoinSplits":"Нет операций (sprout)","No Outputs":"Нет выходов","No Shielded Spends and Outputs":"Нет операций (sapling)","No blocks yet.":"Пока нет блоков.","No matching records found!":"Не найдено записей!","No. Transactions":"Всего транзакций","Number Of Transactions":"Количество транзакций","Output":"Выход","Powered by":"Powered by","Previous Block":"Предыдущий блок","Protocol Version":"Версия протокола","Proxy setting":"Настройки proxy","Public input":"Публичный вход","Public output":"Публичный выход","Raw transaction data":"Raw данные транзакции","Raw transaction data must be a valid hexadecimal string.":"Raw данные транзакции должны быть правильной hex строкой.","Received Time":"Время получения","Redirecting...":"Перенаправление ...","Search for block, transaction, address or Verus ID":"Поиск блока, транзакции, адреса или идентификатора Verus","See all blocks":"Просмотр всех блоков","Send transaction":"Отправить транзакцию","Show all":"Показать все","Show input":"Показать вход","Show less":"Скрыть","Show more":"Показать","Signature":"Подпись","Size":"Размер","Size (bytes)":"Размер (байт)","Skipped Blocks (previously synced)":"Пропущенные блоки (ранее синхронизированные)","Start Date":"Время начала","Status":"Статус","Summary":"Итог","Summary <small>confirmed</small>":"Итог <small>подтвержденный</small>","Sync Progress":"Синхронизация","Sync Status":"Статус синхронизации","Sync Type":"Тип синхронизации","Synced Blocks":"Синхронизировано блоков","The message failed to verify.":"Проверка подписи сообщения не пройдена.","The message is verifiably from {{verification.address}}.":"Сообщение подписано отправителем {{verification.address}}.","There are no transactions involving this address.":"Для этого адреса нет транзакций.","This form can be used to broadcast a raw transaction in hex format over\n        the Verus network.":"Эта форма может быть использована для отправки raw транзакции в hex\n        формате через сеть.","This form can be used to verify that a message comes from\n        a specific Verus address.":"Эта форма может быть использована для проверки\n        отправителя (адреса) сообщения.","Time Offset":"Смещение времени","Timestamp":"Дата / время","Today":"Сегодня","Total Received":"Всего получено","Total Sent":"Всего отправлено","Transaction":"Транзакция","Transaction succesfully broadcast.<br>Transaction id: {{txid}}":"Транзакция успешно отправлена.<br>TXID: {{txid}}","Transactions":"Транзакции","Type":"Тип","Unconfirmed":"Нет подтверждений","Unconfirmed Transaction!":"Неподтвержденная транзакция!","Unconfirmed Txs Balance":"Баланс неподтвержденных транзакций","Value Out":"Сумма","Verify":"Проверить","Verify signed message":"Проверить подпись сообщения","Version":"Версия","Waiting for blocks...":"Ожидание блоков...","Waiting for transactions...":"Ожидание транзакций...","What is":"What is","by date.":"по дате.","first seen at":"первое появление","mined":"дата","mined on:":"дата:"});
/* jshint +W100 */
}]);