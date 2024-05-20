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

    //TEMP
    // const defaultLegendClickHandler = Chart.defaults.global.legend.onClick;
    // var newLegendClickHandler = function (e, legendItem) {  
    // var index = legendItem.datasetIndex;
    // console.log(index);

    // // if (index > 1) {
    // //     // Do the original logic
    // //     defaultLegendClickHandler(e, legendItem);
    // // } else {
    // //     let ci = this.chart;
    // //     [
    // //         ci.getDatasetMeta(0),
    // //         ci.getDatasetMeta(1)
    // //     ].forEach(function(meta) {
    // //         meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
    // //     });
    // //     ci.update();
    // // }
    // };
    // //TEMP


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
                fontColor: 'rgb(255, 99, 132)',
            },
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
        // $scope.onClick = function (points, evt) {
        //     console.log(points[0], evt);
        //     console.log(evt);
        // };

        // $scope.onClick = function(e, legendItem) {
        //     var index = legendItem.datasetIndex;
        //     var ci = this.chart;
        //     // var meta = ci.getDatasetMeta(index);
        //     console.log("prrinin");
        //     // console.log(meta);
        //     console.log(e[0]._chart);
        //     console.log(e[0]._chart.config);
        //     console.log(index);
        //     // console.log(legendItem);
        //     // console.log(index);
        
        //     // // See controller.isDatasetVisible comment
        //     // meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
        
        //     // // We hid a dataset ... rerender the chart
        //     // ci.update();
        // }

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

        // const chartLabels = _formatLabelAsLink(data.labels);
        const chartLabels = data.labels;
        const chartData = data.data;
        $scope.labelsConsensusPie = ['PoW', 'PoS'];
        $scope.dataConsensusPie = _getConsensusPieData(chartData.blockType.data);

        $scope.labelsConsensus = chartLabels;
        $scope.dataConsensus = _getConsensusBarData(chartData.blockType.data);

        $scope.labelsSize = chartLabels;
        $scope.dataSize = chartData.size.data;

        // $scope.dataSizeBubble = _getSizeBubbleData(data.data[dataIndex.size]);



        $scope.labelsDiff = chartLabels;
        $scope.dataDiff = chartData.diff.data;

        $scope.labelsTxCount = chartLabels;
        $scope.dataTxCount = chartData.txCount.data;

        $scope.labelsMinedValue = chartLabels;
        $scope.dataMinedValue = chartData.minedValue.data;

        $scope.labelsTxFee = chartLabels;
        $scope.dataTxFee = chartData.totalTxFee.data;

        $scope.labelsBlockTime = chartLabels;
        $scope.dataBlockTime = chartData.blockTime.data;

        $scope.titleTotalBlockVoutValue = "Volume ("+chartData.totalBlockVoutValue.options.conv.unit+ ") " + netSymbol;
        $scope.labelsTotalBlockVoutValue = chartLabels;
        $scope.dataTotalBlockVoutValue = chartData.totalBlockVoutValue.data;
        
        $scope.loading = false;
    }

    // const _formatLabelAsLink = function(labels) {
    //     // var result = [];
    //     // for (var i = 0; i < labels.length; i++) {
    //     //     result[i] = '<a href="/blocks/'+labels[i]+'"> '+ labels[i] + '</a>';
    //     // }

    //     // return result;
    //     return labels;
    // }

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