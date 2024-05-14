function BlockBasicInfo($scope, VerusExplorerApi, LocalStore) {
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
        const chartTypeName = chart.types.blockBasicInfo.apiName;
        const defaultRangeSelected = 2;
        const cacheKeys = localStore.charts.keys;
        const rangeSelectionOptions = [
            { label: 'Last 10', key: 'last10', cache: cacheKeys.last10 },
            { label: 'Last 50', key: 'last50', cache: cacheKeys.last50 },
            { label: 'Last 100', key: 'last100', cache: cacheKeys.last100 },
            { label: 'Last 500', key: 'last500', cache: cacheKeys.last500 },
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
                _createChartData(undefined, range, cachedData);
                return;
            }

            VerusExplorerApi
            .getChartData(chartTypeName, range.key)
            .then(function(queryResult) {
                const data = queryResult.data;
                if (!queryResult.error && data.labels[0] != undefined) {
                    _createChartData(data, range);
                }
            });
        }

        const _getCacheIds = function(cacheSuffix, cacheIds) {
            return {
                key: cacheIds.key + ':' + cacheSuffix,
                ttl: cacheIds.ttl
            }
        }

        const _createChartData = function (data, range, cachedData) {
            $scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
            $scope.onClick = function (points, evt) {
                console.log(points[0], evt);
            };

            $scope.options = {
                legend: {
                    display: true,
                    labels: {
                        color: 'red'
                    }
                }
            };
            
            $scope.optionsBarBase = {
                animation: {
                    duration: 0
                  },
                  elements: {
                    line: {
                      borderWidth: 0.5
                    },
                    point: {
                      radius: 0
                    }
                  },
                legend: {
                    display: false,
                    labels: {
                        color: 'red'
                    }
                },
                scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }],
                    gridLines: {
                      display: false,
                    //   borderDash: [ 20, 20 ],
                    }
                },
                tooltips: {
                  enabled: true
                }
            };

            $scope.optionsBlockType = {
                animation: {
                  duration: 0
                },
                elements: {
                  line: {
                    borderWidth: 0.5
                  },
                  point: {
                    radius: 0
                  }
                },
                legend: {
                  display: false
                },
                scales: {
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    display: true
                  }],
                  gridLines: {
                    display: false
                  }
                },
                tooltips: {
                  enabled: true
                }
              };

            const dataIndex = {
                size: 0,
                diff: 1,
                txFee: 2,
                txCount: 3,
                blockType: 4,
            }

            //Block Type
            $scope.titleBlockType = "Type";
            $scope.seriesBlockType = [ "PoW", "PoS" ];
            $scope.labelsBlockType = [];
            $scope.dataBlockType = [];

            $scope.labelsBlockTypePie = [];
            $scope.dataBlockTypePie = [];

            //Size
            $scope.titleSize = "Size (bytes)";
            $scope.seriesSize = [ "Size in bytes" ];
            $scope.labelsSize = [];
            $scope.dataSize = [];
            
            $scope.dataSizeBubble = []
            
            //Difficulty
            $scope.titleDiff = "Difficulty (1B)";
            $scope.seriesDiff = [ "Difficulty" ];
            $scope.labelsDiff = [];
            $scope.dataDiff = [];
            
            //TX Fee
            $scope.titleTxFee = "Transaction Fee";
            $scope.seriesTxFee = [ "Tx Fee" ];
            $scope.labelsTxFee = [];
            $scope.dataTxFee = [];
            
            //TX Count
            $scope.titleTxCount = "Transaction Count";
            $scope.labelsTxCount = [];
            $scope.dataTxCount = [];
            

            if(cachedData != undefined) {
                data = cachedData;
            } else {
                const c = _getCacheIds(chartTypeName, range.cache)
                _saveToCache(data, c.key, c.ttl);
            }
            
            $scope.labelsBlockTypePie = [ 'Proof of Work', 'Proof of Stake' ];
            $scope.dataBlockTypePie = _getBlockTypePieData(data.data[dataIndex.blockType]);

            $scope.labelsBlockType = data.labels;
            $scope.dataBlockType = _getBlockTypeBarData(data.data[dataIndex.blockType]);

            $scope.labelsSize = data.labels;
            $scope.dataSize = data.data[dataIndex.size];

            $scope.dataSizeBubble = _getSizeBubbleData(data.data[dataIndex.size]);
            
            
            $scope.labelsDiff = data.labels;
            $scope.dataDiff = data.data[dataIndex.diff];
            
            $scope.labelsTxFee = data.labels;
            $scope.dataTxFee = data.data[dataIndex.txFee];
            
            $scope.labelsTxCount = data.labels;
            $scope.dataTxCount = data.data[dataIndex.txCount];
        }

        const _getBlockTypePieData = function(data) {
            var result = {
                pow: 0,
                pos: 0,
            }
            for(var i = 0; i < data.length; i++) {
                const key = data[i] == 1 ? 'pow' : 'pos';
                result[key] = result[key] + 1;
            }
            return [ result.pow, result.pos ];
        }
        
        const _getBlockTypeBarData = function(data) {
            var pow = [];
            var pos = [];
            for(var i = 0; i < data.length; i++) {
                pow.unshift(data[i] == 1 ? 1 : 0);
                pos.unshift(data[i] == 1 ? 0 : 1)
            }
            return [
                pow,
                pos,
            ];
        }
        
        const _getSizeBubbleData = function(data) {
            var result = [];
            const size = data.length;
            for(var i = 0; i < size; i++) {
                result.unshift([{
                    x: Math.floor(Math.random() * size),
                    y: Math.floor(Math.random() * size),
                    r: data[i] / 500
                }]);
            }
            return result;
        }
        // $scope.params = $routeParams;

}