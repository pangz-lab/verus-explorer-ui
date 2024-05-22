'use strict';

angular
.module('insight.search')
.controller('SearchController',
    function (
        $scope,
        $location,
        $timeout,
        // Global,
        VerusExplorerApi
    ) {
        //$scope.global = Global;
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

        var _badSearch = function() {
            $scope.loading = false;
            _resetSearch();
            _badQuery();
        }

        $scope.search = function () {
            var q = $scope.q;
            $scope.badQuery = false;
            $scope.loading = true;
            
            if($location.path().endsWith(q)) {
                _resetSearch();
                return;
            }
            if(q.length > 200 || !allowedSearchPattern.test(q)) {
                _badSearch();
            }

            try {
                VerusExplorerApi
                .search(q)
                .then(function (r) {
                    const path = _createPath(r.data);
                    if(r.error || path == undefined) {
                        _badSearch();
                        return;
                    }

                    $location.path(path);
                    $scope.loading = false;
                    _resetSearch();
                })
                
            } catch (e) {;
                _badSearch();
            }
        };

    }
);
