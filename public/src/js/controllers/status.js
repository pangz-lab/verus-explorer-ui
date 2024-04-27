'use strict';

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
