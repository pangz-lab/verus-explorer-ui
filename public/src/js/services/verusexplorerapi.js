'use strict';

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
      return sendRequest(createPayload('/api/identity/info', [identityName, height]));
    };
    
    function getAddressTxIds(address) {
      return sendRequest(createPayload('/api/address/'+address+'/txids', [], "GET"));
    };
    
    function getAddressBalance(address) {
      return sendRequest(createPayload('/api/address/'+address+'/balance', [], "GET"));
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
    };
});