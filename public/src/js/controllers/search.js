'use strict';

angular
.module('insight.search')
.controller('SearchController',
    function (
        $scope,
        $location,
        $timeout,
        Global,
        VerusExplorerApi
    ) {
        $scope.global = Global;
        $scope.loading = false;

        var _badQuery = function () {
            $scope.badQuery = true;
            $timeout(function () {
                $scope.badQuery = false;
            }, 2000);
        };

        var _resetSearch = function () {
            $scope.q = '';
            $scope.loading = false;
        };

        const _createPath = function(q) {
            const v = q.value;
            switch(q.type) {
                case 'block': return 'block/' + v;
                case 'blockHash': return 'block/' + v;
                case 'verusId': return 'address/' + v;
                case 'address': return 'address/' + v;
                case 'txHash': return 'tx/' + v;
            }
            return undefined;
        }

        $scope.search = function () {
            var q = $scope.q;
            $scope.badQuery = false;
            $scope.loading = true;
            console.log(q);
            console.log($location.path());

            if($location.path().endsWith(q)) {
                _resetSearch();
                return;
            }

            try {
                VerusExplorerApi
                .search(q)
                .then(function (r) {
                    const path = _createPath(r.data);
                    if(r.error || path == undefined) {
                        $scope.loading = false;
                        _resetSearch();
                        _badQuery();
                        return;
                    }

                    $location.path(path);
                    $scope.loading = false;
                    _resetSearch();
                })
                
            } catch (e) {
                console.log(e);
                $scope.loading = false;
                _resetSearch();
                _badQuery();
                $location.path('/');
            }
            
            // const lastChar = q.charAt(q.length - 1);

            // if (lastChar === '@') {
            //     VerusExplorerApi
            //     .getIdentity(q)
            //     .then(function (idInfo) {
            //         if (idInfo.data.identity) {
            //             //Request is a VerusID - get the address
            //             $location.path('address/' + idInfo.data.identity.identityaddress);
            //             _resetSearch();
            //             return;
            //         }

            //         $scope.loading = false;
            //         _resetSearch();
            //         _badQuery();
            //     });
            //     return;
            // }

            // VerusExplorerApi
            // .getBlockInfo(q)
            // .then(function (blockInfo) {
            //     if (blockInfo.data.hash) {
            //         // Either block height or block hash
            //         $location.path('block/' + blockInfo.data.hash);
            //         _resetSearch();
            //         return;
            //     }

            //     VerusExplorerApi
            //     .getAddressTxIds(q)
            //     .then(function (r) {
            //         if (r.data[0]) {
            //             //Request is address
            //             $location.path('address/' + q);
            //             _resetSearch();
            //             return;
            //         }

            //         VerusExplorerApi
            //         .getTransactionInfo(q)
            //         .then(function (r) {
            //             if (r.data.height) {
            //                 //Request is a transaction hash
            //                 $location.path('tx/' + q);
            //                 _resetSearch();
            //                 return;
            //             }

            //             $scope.loading = false;
            //             _resetSearch();
            //             _badQuery();
            //         })
            //     })
            // });
            // 2558891ef5d54ce3e82503655a22c05a774e62be695bbe26454dae93de480cac - 64
            // iHbTMYB43xqqFVmEqJkqff6GrZDQoaiq6g - 34

            // Block.get({
            //   blockHash: q
            // }, function() {
            //   _resetSearch();
            //   $location.path('block/' + q);
            // }, function() { //block not found, search on TX
            //   Transaction.get({
            //     txId: q
            //   }, function() {
            //     _resetSearch();
            //     $location.path('tx/' + q);
            //   }, function() { //tx not found, search on Address
            //     Address.get({
            //       addrStr: q
            //     }, function() {
            //       _resetSearch();
            //       $location.path('address/' + q);
            //     }, function() { // block by height not found
            //       if (isFinite(q)) { // ensure that q is a finite number. A logical height value.
            //         BlockByHeight.get({
            //           blockHeight: q
            //         }, function(hash) {
            //           _resetSearch();
            //           $location.path('/block/' + hash.blockHash);
            //         }, function() { //not found, fail :(
            //           $scope.loading = false;
            //           _badQuery();
            //         });
            //       }
            //       else {
            //         $scope.loading = false;
            //         _badQuery();
            //       }
            //     });
            //   });
            // });
        };

    }
);
