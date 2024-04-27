'use strict';

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
        $scope.global = Global;
        $scope.loading = false;
        $scope.currentDateTxList = [];
        $scope.lastStartIndex = 0;
        $scope.remainingTxCount = 0;
        $scope.pagination = {};
        const MAX_HASH_PER_LOAD = 100;
        // const DATE_TYPE_UTC = 1; // 1 UTC;
        // const DATE_TYPE_LOCAL = 0; // 0 local;
        // $scope.allTxs 


        // var wsChannel = VerusWssClient.getClient();
        // function wsEventHandler(event) {
        //     lastReceivedTime = new Date().getTime();
        //     console.log('Message from server: >> THIS BLOCK SCOPE >>', event.data);
        // }
        // wsChannel.addEventListener('message', wsEventHandler);
        // $scope.$on('$destroy', function () {
        //     console.log("Destroying block controller resource");
        //     $interval.cancel(lazyLoadingInterval);
        //     lazyLoadingInterval = undefined;
        //     wsChannel.removeEventListener('message', wsEventHandler);
        // });

        // // TODO, put in rootscope
        // $scope.scrollToTop = function () {
        //     ScrollService.scrollToTop();
        // };

        $rootScope.scrollToTop = function () {
            ScrollService.scrollToTop();
        };
        $rootScope.scrollToBottom = function () {
            ScrollService.scrollToBottom();
        };

        // if ($routeParams.blockHeight) {
        //   // Will receive the redirect from status page when the "Blocks" value is clicked
        //   _handleRedirectFromStatusPage($routeParams.blockHeight);
        // }

        // var _handleRedirectFromStatusPage = function(blockHeight) {
        //   VerusdRPC.getBlockDetailByHeight(blockHeight)
        //   .then(function(data) {
        //     $location.path('block/' + data.result.hash);
        //   })
        //   .catch(function(_) {
        //     $rootScope.flashMessage = 'Bad Request';
        //     $location.path('/');
        //   });
        // }

        //Datepicker
        var _setCalendarDate = function (date) { $scope.dt = date; };

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
            const isUtc = false;
            var yyyy = (isUtc ? date.getUTCFullYear() : date.getFullYear()).toString();
            var mm = ((isUtc ? date.getUTCMonth() : date.getMonth()) + 1).toString(); // getMonth() is zero-based
            var dd = (isUtc ? date.getUTCDate() : date.getDate()).toString();

            return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); //padding
        };

        $scope.$watch('dt', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $location.path('/blocks-date/' + _formatTimestamp(new Date(newValue)));
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
        
        $scope.list = function () {
            $scope.loading = true;

            if ($routeParams.blockDate) {
                $scope.detail = '🗓 On ' + $routeParams.blockDate;
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
                (new Date($routeParams.blockDate)).toString();

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

        $scope.blocks = [];
        $scope.params = $routeParams;

        // var lazyLoadingInterval = $interval(function () {
        //     console.log("Load more data every 2 seconds...");
        //     $scope.loadMorelist();
        // }, 2000);

        // setTimeout(function () {
        //     if(lazyLoadingInterval != undefined) {
        //         $interval.cancel(lazyLoadingInterval);
        //         lazyLoadingInterval = undefined;
        //     }
        // }, 10000);
    }
);
