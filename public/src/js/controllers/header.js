'use strict';

angular.module('insight.system').controller('HeaderController',
  // function($scope, $rootScope, $modal, getSocket, Global, Block) {
  function($scope, $rootScope, $modal, Global, $location) {
    $scope.global = Global;

    $rootScope.currency = {
      factor: 1,
      bitstamp: 0,
      testnet: testnet,
      netSymbol: netSymbol,
      symbol: netSymbol
    };
    // $scope.currentPath = $location.path();

    $scope.menu = [{
      'title': 'Blocks',
      'link': 'blocks'
    }, {
      'title': 'Charts',
      'link': 'charts'
    }, {
      'title': 'Status',
      'link': 'status'
    }, {
      'title': 'Help',
      'link': 'help'
    }]; 

    $scope.openScannerModal = function() {
      var modalInstance = $modal.open({
        templateUrl: 'scannerModal.html',
        controller: 'ScannerController'
      });
    };

    // var _getBlock = function(hash) {
    //   Block.get({
    //     blockHash: hash
    //   }, function(res) {
    //     $scope.totalBlocks = res.height;
    //   });
    // };

    // var socket = getSocket($scope);
    // socket.on('connect', function() {
    //   socket.emit('subscribe', 'inv');

    //   socket.on('block', function(block) {
    //     var blockHash = block.toString();
    //     _getBlock(blockHash);
    //   });
    // });
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $rootScope.isCollapsed = true;
  });
