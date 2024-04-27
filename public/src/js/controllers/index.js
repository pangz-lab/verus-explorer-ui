'use strict';

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

                $scope.cachedData.visible = false
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
                        diff: status.blocks - missedBlockStart
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
