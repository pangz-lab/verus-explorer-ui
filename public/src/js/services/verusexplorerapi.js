'use strict';

// Todo add caching to avoid reloading of large resource
angular.module('insight.verusexplorerapi')
.factory('VerusExplorerApi',
    function (
        $http,
        $q
    ) {
        const version = 'v1';
        function createPayload(endpoint, params, method) {
            const requestMethod = method == undefined ? "POST" : method;
            return {
                method: requestMethod,
                url: apiServer + endpoint,
                data: { "params": params },
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiToken
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
            return sendRequest(createPayload('/api/'+version+'/blocks/generated', heightOrTxArray));
        };

        function getBlockHashesByRange(start, end) {
            return sendRequest(createPayload('/api/'+version+'/block/hashes', [start, end]));
        };

        function getBlockInfo(blockHeightOrHash) {
            return sendRequest(createPayload('/api/'+version+'/block/' + blockHeightOrHash + "/info", [], "GET"));
        };

        function getBlockchainStatus() {
            return sendRequest(createPayload('/api/'+version+'/blockchain/status', [], "GET"));
        };

        function getBlockchainHeight() {
            return sendRequest(createPayload('/api/'+version+'/blockchain/height', [], "GET"));
        };

        function getBlockchainInfo() {
            return sendRequest(createPayload('/api/'+version+'/blockchain/info', [], "GET"));
        };

        function getMiningInfo() {
            return sendRequest(createPayload('/api/'+version+'/blockchain/mining/info', [], "GET"));
        };

        function getTransactionInfo(txHash) {
            return sendRequest(createPayload('/api/'+version+'/transaction/' + txHash + '/info', [], "GET"));
        };
        
        function getTransactionHexScriptInfo(hexScript) {
            return sendRequest(createPayload('/api/'+version+'/transaction/hexscript/' + hexScript + '/info', [], "GET"));
        };

        function getIdentity(identityName, height) {
            var h = (height == undefined) ? '' : '?height=' + height;
            return sendRequest(createPayload('/api/'+version+'/identity/' + identityName + '/info' + h, [], 'GET'));
        };

        function getAddressTxIds(address) {
            return sendRequest(createPayload('/api/'+version+'/address/' + address + '/txids', [], "GET"));
        };

        function getAddressBalance(address) {
            return sendRequest(createPayload('/api/'+version+'/address/' + address + '/balance', [], "GET"));
        };

        function getChartData(type, range) {
            const ranges = Object.keys(localStore.charts.keys);
            if (!ranges.includes(range)) { return Promise.resolve(undefined); }
            return sendRequest(createPayload('/api/'+version+'/chart/' + type + '/?range=' + range, [], "GET"));
        };
        
        function getAggregatorMarketData(source) {
            return sendRequest(createPayload('/api/'+version+'/a/' + source + '/coin/market', [], "GET"));
        };

        function search(query) {
            return sendRequest(createPayload('/api/'+version+'/search/?q=' + query, [], "GET"));
        };

        return {
            createPayload: function (endpoint, params, method) {
                return createPayload(endpoint, params, method);
            },
            sendRequest: function (payload) {
                return sendRequest(payload);
            },
            getGeneratedBlocks: function (heightOrTxArray) {
                return getGeneratedBlocks(heightOrTxArray);
            },
            getBlockHashesByRange: function (start, end) {
                return getBlockHashesByRange(start, end);
            },
            getBlockInfo: function (blockHeightOrHash) {
                return getBlockInfo(blockHeightOrHash);
            },
            getBlockchainStatus: function () {
                return getBlockchainStatus();
            },
            getBlockchainInfo: function () {
                return getBlockchainInfo();
            },
            getMiningInfo: function () {
                return getMiningInfo();
            },
            getBlockchainHeight: function () {
                return getBlockchainHeight();
            },
            getTransactionInfo: function (txHash) {
                return getTransactionInfo(txHash);
            },
            getTransactionHexScriptInfo: function (hexScript) {
                return getTransactionHexScriptInfo(hexScript);
            },
            getIdentity: function (identityName, height) {
                return getIdentity(identityName, height);
            },
            getAddressTxIds: function (address) {
                return getAddressTxIds(address);
            },
            getAddressBalance: function (address) {
                return getAddressBalance(address);
            },
            getChartData: function (type, range) {
                return getChartData(type, range);
            },
            getAggregatorMarketData: function (source) {
                return getAggregatorMarketData(source);
            },
            search: function (query) {
                return search(query);
            },
        };
});