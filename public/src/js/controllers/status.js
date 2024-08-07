'use strict';

angular
.module('insight.status')
.controller('StatusController',
    function (
        $scope,
        VerusExplorerApi,
        VerusWssClient,
        UnitConversionService,
        LocalStore,
        WsEventDataManager,
        BlockService
    ) {
        $scope.chainName = chainName;
        $scope.loaded = false;
        $scope.info = { blocks: 0 };
        $scope.sync = { syncPercentage: 0 };
        $scope.chainNodeState = {};
        const CACHE_KEY_STATUS = localStore.status.key;
        const CACHE_KEY_NODE_STATE = localStore.nodeState.key;

        const wsTopic = VerusWssClient.getMessageTopic();
        $scope.$on(wsTopic, function(event, rawEventData) {
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
                $scope.loaded = true;
                $scope.$apply();

                // Maintains the global blockchain height;
                // Can be put anywhere as long as the current block height can be received
                BlockService.setCurrentHeight($scope.info.blocks);
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

        $scope.getBlockchainStatus = function () {
            $scope.loaded = false;
            const chainStatus = LocalStore.get(CACHE_KEY_STATUS);
            if(chainStatus != undefined) {
                $scope.info = WsEventDataManager.updateStatusScopeData(chainStatus);
            }

            const nodeStateCache = LocalStore.get(CACHE_KEY_NODE_STATE);
            if(nodeStateCache != undefined) {
                const r = WsEventDataManager.updateChainNodeStateScopeData(nodeStateCache);
                $scope.sync = r.sync;
                $scope.chainNodeState = r.chainNodeState;
                $scope.loaded = true;
                return;
            }

            VerusExplorerApi
                .getBlockchainStatus()
                .then(function (statusResult) {
                    // console.log("statusResult >>>");
                    // console.log(statusResult);
                    if(statusResult.error 
                        && (statusResult.data.status === undefined || statusResult.data.status.error) 
                        && (statusResult.data.nodeState === undefined || statusResult.data.nodeState.error)) { return; }
                    
                    const data = statusResult.data.data;
                    $scope.info = WsEventDataManager.updateStatusScopeData(data.status.data);
                    const r = WsEventDataManager.updateChainNodeStateScopeData(data.nodeState.data);
                    $scope.sync = r.sync;
                    $scope.chainNodeState = r.chainNodeState;
                    $scope.loaded = true;
                });
        };

        $scope.humanSince = function (time) {
            var m = moment.unix(time / 1000);
            return moment.min(m).fromNow();
        };
    });
