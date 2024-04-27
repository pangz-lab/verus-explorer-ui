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