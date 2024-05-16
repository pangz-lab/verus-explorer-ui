function TransactionOverTime($scope, VerusExplorerApi, LocalStore) {
        // function($scope, $rootScope, $routeParams, $location, Chart, Charts) {
        // ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
        $scope.loading = false;
        const _saveToCache = function(data, key, ttl) {
            LocalStore.set(key, data, ttl);
        }
        // TX over time
        // Block size distribution
        // Transaction Fees Over Time
        // Mining pool distribution over time
        const chartTypeName = chart.types.chainBasicInfoOverTime.apiName;
        const defaultRangeSelected = 3;
        const cacheKeys = localStore.charts.keys;
        const rangeSelectionOptions = [
            { label: '10min', key: 'last10Minutes', cache: cacheKeys.last10Minutes },
            { label: '30min', key: 'last30Minutes', cache: cacheKeys.last30Minutes },
            { label: '1hr', key: 'lastHour', cache: cacheKeys.lastHour },
            { label: '3hr', key: 'last3Hours', cache: cacheKeys.last3Hours },
            { label: '6hr', key: 'last6Hours', cache: cacheKeys.last6Hours },
            { label: '12hr', key: 'last12Hours', cache: cacheKeys.last12Hours },
            { label: '24hr', key: 'last24Hours', cache: cacheKeys.last24Hours },
            { label: '3d', key: 'last3Days', cache: cacheKeys.last3Days },
            { label: '1wk', key: 'last7Days', cache: cacheKeys.last7Days },
            { label: '2wk', key: 'last15Days', cache: cacheKeys.last15Days },
            { label: '30d', key: 'last30Days', cache: cacheKeys.last30Days },
            { label: '90d', key: 'last90Days', cache: cacheKeys.last90Days },
        ]
        $scope.rangeSelection = rangeSelectionOptions;
        $scope.rangeSelected = defaultRangeSelected;

        $scope.fetchChartData = function(range) {
            if(range == undefined) {
                range = rangeSelectionOptions[defaultRangeSelected];
            }

            const cacheId = _getCacheIds(chartTypeName, range.cache);
            const cachedData = LocalStore.get(cacheId.key);
            if(cachedData != undefined) {
                _createChartData(null, range, cachedData);
                return;
            }

            VerusExplorerApi
            .getChartData(chartTypeName, range.key)
            .then(function(queryResult) {
                const data = queryResult.data;
                if (!queryResult.error && data.labels[0] != undefined) { _createChartData(data, range); }
            });
        }

        const _getCacheIds = function(cacheSuffix, cacheIds) {
            return {
                key: cacheIds.key + ':' + cacheSuffix,
                ttl: cacheIds.ttl
            }
        }

        const _createChartData = function (data, range, cachedData) {
            const dataIndex = {
                blockCount: 0,
                txCount: 1,
                difficulty: 2,
                minedValue: 3,
            }
            $scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
            $scope.title = "Block Transactions";
            $scope.series = ["Blocks", "Transactions"];
            $scope.labels = [];
            $scope.data = [];
            
            $scope.titleDiff = "Difficulty (10B)";
            $scope.labelsDiff = [];
            $scope.dataDiff = [];
            
            $scope.titleMinedValue = "Rewards";
            $scope.labelsMinedValue = [];
            $scope.dataMinedValue = [];

            $scope.options = {
                legend: {
                    display: true,
                    labels: {
                        color: 'red'
                    }
                }
            };

            if(cachedData != undefined) {
                data = cachedData;
            } else {
                const c = _getCacheIds(chartTypeName, range.cache)
                _saveToCache(data, c.key, c.ttl);
            }

            $scope.labels = data.labels;
            $scope.data = [
                data.data[dataIndex.blockCount],
                data.data[dataIndex.txCount],
            ];

            $scope.labelsDiff = data.labels;
            $scope.dataDiff = data.data[dataIndex.difficulty];
            
            $scope.labelsMinedValue = data.labels;
            $scope.dataMinedValue = data.data[dataIndex.minedValue];
        }
        // $scope.params = $routeParams;

}