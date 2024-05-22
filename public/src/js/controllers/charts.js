'use strict';

angular
    .module('insight.charts', ["chart.js"])
    .controller('ChartsController', function() {})
    .controller('ChainBasicInfoChartController', ChainBasicInfo)
    .controller('BlockBasicInfoChartController', BlockBasicInfo)
    .controller('MiningBasicInfoChartController', MiningBasicInfo);