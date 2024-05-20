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
        UnitConversionService,
        VerusExplorerApi,
        VerusWssClient,
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

        const wsTopic = VerusWssClient.getMessageTopic();
        $scope.$on(wsTopic, function(event, rawEventData) {
            if($scope.pagination.isToday && rawEventData.latestBlock.data !== undefined) {
                var data = rawEventData.latestBlock.data;
                data.txCount = data.txs.length;
                $scope.blocks.push(data);
                $scope.currentDateTxList.push(data.hash);
            }
        });

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
            value = new Date(value);
            if(value.getTime() > (new Date()).getTime()) {
                _setAlertMessage(true, "Choose current date or previous date only!");
                setTimeout(function() {
                    _setAlertMessage(false, "");
                }, 3000)
                return false;
            }

            if(value.getTime() < (firstBlockStartDate).getTime()) {
                _setAlertMessage(true, "Choose date not older than " + firstBlockStartDate.toUTCString());
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
            return UnitConversionService.createDateFromString(dateString);
            // const splitDate = dateString.split('-');
            // const year = parseInt(splitDate[0], 10);
            // const month = parseInt(splitDate[1], 10);
            // const day = parseInt(splitDate[2], 10);
            // const months = [
            //     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            //     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            // ];
            // const isoStr = day + ' ' + months[month - 1] + ' ' + year + ' 00:00:00';
            // return  new Date(isoStr);
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
            const d = (new Date((date * 1000) + 2)).toUTCString();
            return d.slice(0, d.length - 3);
        }
        
        $scope.toLocal = function(d) {
            // const d = (new Date(date * 1000)).to();
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
        // $scope.params = $routeParams;
    }
);
