function BlockBasicInfo(
    $scope,
    VerusExplorerApi,
    LocalStore) {
    $scope.loading = false;
    $scope.options = {
        legend: {
            display: true,
            labels: {
                color: 'red'
            }
        }
    };

    $scope.optionsTxFee = {
        scales: {
            xAxes: [{
                display: true
            }],
            yAxes: [{
                display: true,
                ticks: {
                    min: 0.00001,
                    stepSize: 0.1
                }
            }],
            gridLines: {
                display: false,
                //   borderDash: [ 20, 20 ],
            }
        },

    }
    $scope.optionsBarBase = {
        animation: {
            duration: 0
        },
        elements: {
            line: {
                borderWidth: 0
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
                display: true,
            }],
            gridLines: {
                display: false,
                //   borderDash: [ 20, 20 ],
            },
        },
        tooltips: {
            enabled: true
        }
    };

    const _saveToCache = function (data, key, ttl) {
        LocalStore.set(key, data, ttl);
    }

    const chartTypeName = chart.types.blockBasicInfo.apiName;
    const defaultRangeSelected = 2;
    const cacheKeys = localStore.charts.keys;
    const rangeSelectionOptions = [
        { label: '10', key: 'last10', cache: cacheKeys.last10 },
        { label: '50', key: 'last50', cache: cacheKeys.last50 },
        { label: '100', key: 'last100', cache: cacheKeys.last100 },
        { label: '250', key: 'last250', cache: cacheKeys.last250 },
        { label: '500', key: 'last500', cache: cacheKeys.last500 },
        { label: '1k', key: 'last1000', cache: cacheKeys.last1000 },
        { label: '1.25k', key: 'last1250', cache: cacheKeys.last1250 },
        { label: '1.5k', key: 'last1500', cache: cacheKeys.last1500 },
    ]
    $scope.generationMessage = "";
    $scope.rangeSelection = rangeSelectionOptions;
    $scope.rangeSelected = defaultRangeSelected;
    $scope.selectedLabel = rangeSelectionOptions[$scope.rangeSelected].label;
    $scope.colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    $scope.colorsConsensus = ['#3165d3', '#3165d3'];

    $scope.cancelLoading = function () {
        $scope.loading = false;
    }

    $scope.fetchChartData = function (range, index) {
        if (range == undefined) {
            range = rangeSelectionOptions[defaultRangeSelected];
            index = defaultRangeSelected;
        }
        $scope.selectedLabel = range.label;
        $scope.rangeSelected = index;
        $scope.loading = true;
        $scope.generationMessage = "Fetching data ...";
        

        const cacheId = _getCacheIds(chartTypeName, range.cache);
        const cachedData = LocalStore.get(cacheId.key);
        if (cachedData != undefined) {
            _createChartData(undefined, range, cachedData);
            return;
        }

        VerusExplorerApi
            .getChartData(chartTypeName, range.key)
            .then(function (queryResult) {
                const data = queryResult.data;
                $scope.generationMessage = "Generating charts ...";
                if (!queryResult.error && data != undefined) {
                    _createChartData(data, range);
                }
            });
    }

    const _getCacheIds = function (cacheSuffix, cacheIds) {
        return {
            key: cacheIds.key + ':' + cacheSuffix,
            ttl: cacheIds.ttl
        }
    }

    const _createChartData = function (data, range, cachedData) {
        $scope.onClick = function (points, evt) {
            console.log(points[0], evt);
            console.log(evt);
        };

        $scope.optionsConsensus = {
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
                    display: true
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        max: 1,
                        min: -1,
                        stepSize: 0.5
                    }
                }],
                gridLines: {
                    display: false
                }
            },
            tooltips: {
                enabled: true
            }
        };
        //Block Type
        $scope.titleConsensus = "Consensus";
        $scope.seriesConsensus = ["PoW", "PoS"];
        $scope.labelsConsensus = [];
        $scope.dataConsensus = [];

        $scope.labelsConsensusPie = [];
        $scope.dataConsensusPie = [];

        //Size
        $scope.titleSize = "Size (kB)";
        $scope.seriesSize = ["Size in bytes"];
        $scope.labelsSize = [];
        $scope.dataSize = [];

        // $scope.dataSizeBubble = []

        //Difficulty
        $scope.titleDiff = "Difficulty (1T)";
        $scope.seriesDiff = ["Difficulty"];
        $scope.labelsDiff = [];
        $scope.dataDiff = [];

        //TX Count
        $scope.titleTxCount = "Transactions";
        $scope.labelsTxCount = [];
        $scope.dataTxCount = [];

        //Mined Value
        $scope.titleMinedValue = "Rewards";
        $scope.labelsMinedValue = [];
        $scope.dataMinedValue = [];

        //TX Fee
        $scope.titleTxFee = "Transaction Fee";
        $scope.seriesTxFee = ["Tx Fee"];
        $scope.labelsTxFee = [];
        $scope.dataTxFee = [];

        //Block Time
        $scope.titleBlockTime = "Block Time (sec)";
        $scope.seriesBlockTime = ["Block Time"];
        $scope.labelsBlockTime = [];
        $scope.dataBlockTime = [];
        
        //Block Vout Value
        $scope.titleTotalBlockVoutValue = "Volume ("+netSymbol +")";
        $scope.labelsTotalBlockVoutValue = [];
        $scope.dataTotalBlockVoutValue = [];


        if (cachedData != undefined) {
            data = cachedData;
        } else {
            const c = _getCacheIds(chartTypeName, range.cache)
            _saveToCache(data, c.key, c.ttl);
        }

        const chartData = data.data;
        $scope.labelsConsensusPie = ['PoW', 'PoS'];
        $scope.dataConsensusPie = _getConsensusPieData(chartData.blockType.data);

        $scope.labelsConsensus = data.labels;
        $scope.dataConsensus = _getConsensusBarData(chartData.blockType.data);

        $scope.labelsSize = data.labels;
        $scope.dataSize = chartData.size.data;

        // $scope.dataSizeBubble = _getSizeBubbleData(data.data[dataIndex.size]);


        $scope.labelsDiff = data.labels;
        $scope.dataDiff = chartData.diff.data;

        $scope.labelsTxCount = data.labels;
        $scope.dataTxCount = chartData.txCount.data;;

        $scope.labelsMinedValue = data.labels;
        $scope.dataMinedValue = chartData.minedValue.data;;

        $scope.labelsTxFee = data.labels;
        $scope.dataTxFee = chartData.totalTxFee.data;

        $scope.labelsBlockTime = data.labels;
        $scope.dataBlockTime = chartData.blockTime.data;;
        
        $scope.labelsBlockVoutValue = data.labels;
        $scope.dataTotalBlockVoutValue = chartData.totalBlockVoutValue.data;

        
        $scope.loading = false;
    }

    const _getConsensusPieData = function (data) {
        var result = {
            pow: 0,
            pos: 0,
        }
        for (var i = 0; i < data.length; i++) {
            const key = data[i] == 1 ? 'pow' : 'pos';
            result[key] = result[key] + 1;
        }
        return [
            result.pow,
            result.pos,
        ];
    }

    //TODO merge with piechart
    const _getConsensusBarData = function (data) {
        // var pow = [];
        // var pos = [];
        var e = [];
        for (var i = 0; i < data.length; i++) {
            // pow[i] = data[i] === 1 ? 1 : 0;
            // pos[i] = data[i] === -1 ? -1 : 0;
            e[i] = 0;
        }
        return [
            data,
            e,
        ];
        // return data;
    }

    // const _getSizeBubbleData = function(data) {
    // const _getSizeBubbleData = function(data) {
    //     var result = [];
    //     const size = data.length;
    //     for(var i = 0; i < size; i++) {
    //         result.unshift([{
    //             x: Math.floor(Math.random() * size),
    //             // x: labels[i],
    //             y: Math.floor(Math.random() * size),
    //             r: data[i] / 600
    //         }]);
    //     }
    //     return result;
    // }
    // $scope.params = $routeParams;

}