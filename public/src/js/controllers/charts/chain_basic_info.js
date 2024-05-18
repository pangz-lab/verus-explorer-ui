function ChainBasicInfo(
    $scope,
    VerusExplorerApi,
    LocalStore,
    UnitConversionService) {

    $scope.loading = false;
    const _saveToCache = function(data, key, ttl) {
        LocalStore.set(key, data, ttl);
    }

    const chartTypeName = chart.types.chainbasicinfo.apiName;
    const defaultRangeSelected = 1;
    const cacheKeys = localStore.charts.keys;
    const labelType = {
        withYear: 1,
        withMonth: 2,
        withDay: 3,
        withMinute: 4,
    }
    const rangeSelectionOptions = [
        { label: '10min', key: 'last10Minutes', cache: cacheKeys.last10Minutes, labelType: labelType.withMinute },
        { label: '30min', key: 'last30Minutes', cache: cacheKeys.last30Minutes, labelType: labelType.withMinute },
        { label: '1hr', key: 'lastHour', cache: cacheKeys.lastHour, labelType: labelType.withMinute },
        { label: '3hr', key: 'last3Hours', cache: cacheKeys.last3Hours, labelType: labelType.withMinute },
        { label: '6hr', key: 'last6Hours', cache: cacheKeys.last6Hours, labelType: labelType.withMinute },
        { label: '12hr', key: 'last12Hours', cache: cacheKeys.last12Hours, labelType: labelType.withMinute },
        { label: '24hr', key: 'last24Hours', cache: cacheKeys.last24Hours, labelType: labelType.withMinute },
        { label: '3d', key: 'last3Days', cache: cacheKeys.last3Days, labelType: labelType.withDay },
        { label: '1wk', key: 'last7Days', cache: cacheKeys.last7Days, labelType: labelType.withMonth },
        { label: '2wk', key: 'last15Days', cache: cacheKeys.last15Days, labelType: labelType.withYear },
        { label: '30d', key: 'last30Days', cache: cacheKeys.last30Days, labelType: labelType.withYear },
        { label: '90d', key: 'last90Days', cache: cacheKeys.last90Days, labelType: labelType.withYear },
    ]
    $scope.rangeSelection = rangeSelectionOptions;
    $scope.rangeSelected = defaultRangeSelected;
    $scope.selectedLabel = rangeSelectionOptions[$scope.rangeSelected].label;
    
    $scope.generationMessage = "";
    $scope.colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    $scope.title = "Block Transactions";
    $scope.series = ["Blocks", "Transactions"];
    $scope.labels = [];
    $scope.data = [];
    
    $scope.titleDiff = "Difficulty (1T)";
    $scope.labelsDiff = [];
    $scope.dataDiff = [];
    
    $scope.titleMinedValue = "Rewards";
    $scope.labelsMinedValue = [];
    $scope.dataMinedValue = [];

    $scope.titleTotalBlockVoutValue = "Volume (1k)";
    $scope.labelsTotalBlockVoutValue = [];
    $scope.dataTotalBlockVoutValue = [];

    $scope.options = {
        legend: {
            display: true,
            labels: {
                color: 'red'
            }
        }
    };

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
        if(cachedData != undefined) {
            _createChartData(null, range, cachedData);
            return;
        }

        VerusExplorerApi
        .getChartData(chartTypeName, range.key)
        .then(function(queryResult) {
            const data = queryResult.data;
            $scope.generationMessage = "Generating charts ...";
            if (!queryResult.error && data != undefined) { _createChartData(data, range); }
        });
    }

    const _getCacheIds = function(cacheSuffix, cacheIds) {
        return {
            key: cacheIds.key + ':' + cacheSuffix,
            ttl: cacheIds.ttl
        }
    }

    const _createChartData = function (data, range, cachedData) {
        if(cachedData != undefined) {
            data = cachedData;
        } else {
            const c = _getCacheIds(chartTypeName, range.cache)
            _saveToCache(data, c.key, c.ttl);
        }
        
        
        const chartData = data.data;
        const labels = _formatDateLabels(data.labels, range.labelType);
        $scope.labels = labels;
        $scope.data = [
            chartData.blockCount.data,
            chartData.txCount.data,
        ];

        $scope.labelsDiff = labels;
        $scope.dataDiff = chartData.difficulty.data;

        $scope.labelsMinedValue = labels;
        $scope.dataMinedValue = chartData.miningReward.data;

        $scope.titleTotalBlockVoutValue = "Volume ("+chartData.totalBlockVoutValue.options.conv.unit+ ") "+netSymbol;
        $scope.labelsTotalBlockVoutValue = labels;
        $scope.dataTotalBlockVoutValue = chartData.totalBlockVoutValue.data;

        $scope.loading = false;
    }

    const _formatDateLabels = function(dateLabels, type) {
        var result = [];
        for(var i = 0; i < dateLabels.length; i++) {
            result[i] = _formatDateLabel(dateLabels[i], type);
        }
        return result
    }
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const _formatDateLabel = function(dateLabel, type) {
        const parts = dateLabel.split(' ');
        var h = "";
        var m = "";
        if(parts[1] == undefined) {
            h = "00";
            m = "00";
        } else {
            const timeParts = parts[1].split(':');
            h = timeParts[0].toString().padStart(2, '0');
            m = timeParts[1].toString().padStart(2, '0');
        }
        
        const date = UnitConversionService
        .createDateFromString(dateLabel, h, m, '/');

        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');

        if(type == labelType.withYear) {
            return year + '/' + month + '/' + day;
        }
        
        if(type == labelType.withMonth) {
            return month + '/' + day + ' ' + hour + 'h';
        }
        
        if(type == labelType.withDay) {
            return dayOfWeek + ' ' + hour + ':' + minute;
        }

        return hour + ':' + minute;
    }
}