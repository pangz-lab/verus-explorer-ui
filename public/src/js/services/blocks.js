'use strict';
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
