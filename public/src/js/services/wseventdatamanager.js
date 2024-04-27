'use strict';

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