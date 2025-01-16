'use strict';

angular
.module('insight.help')
.controller('HelpController',
    function (
        $scope,
        $window,
        VerusExplorerApi
    ) {
        const host = apiServer;
        const address = "R9HC5WtHbpoa51NCUAz86XLCmGTbkf45NT";
        const tx = "57fc2c458fd27ab212e23feebcd14f2f2a9de16bff413d8e11402dfdb0c5bdcc";
        const ver = 'v1';

        $scope.openRequest= function(url) {
            console.log(url);
            VerusExplorerApi.sendRequest(VerusExplorerApi.createPayload(url, [], 'GET'))
            .then(function(response) {
                const result = response.data;
                const resultString = JSON.stringify(result, null, 2);
                const newWindow = $window.open(url, '_blank');
                newWindow.document.write('<pre>' + resultString + '</pre>');
            }).catch(function(error) {
                console.error('Error occurred:', error);
            });
        }
        
        $scope.openExternalPage = function(url) {
            $window.open(url, '_blank');
        }
        $scope.apis = [
            {"title": "Blockchain Height", "url": "/api/" + ver + "/blockchain/height", "urlText": host + "/api/" + ver + "/blockchain/height"},
            {"title": "Blockchain Status", "url": "/api/" + ver + "/blockchain/status", "urlText": host + "/api/" + ver + "/blockchain/status"},
            {"title": "Blockchain Info", "url": "/api/" + ver + "/blockchain/info", "urlText": host + "/api/" + ver + "/blockchain/info"},
            {"title": "Blockchain Mining Info", "url": "/api/" + ver + "/blockchain/mining/info", "urlText": host + "/api/" + ver + "/blockchain/mining/info"},
            {"title": "Block Info", "url": "/api/" + ver + "/block/1/info", "urlText": host + "/api/" + ver + "/block/1/info"},
            {"title": "Address Balance", "url": "/api/" + ver + "/address/"+address+"/balance", "urlText": host + "/api/" + ver + "/address/"+address+"/balance"},
            {"title": "Address Tx IDs", "url": "/api/" + ver + "/address/"+address+"/txids?maxHeight=1", "urlText": host + "/api/" + ver + "/address/"+address+"/txids?maxHeight=1"},
            {"title": "Identity Info", "url": "/api/" + ver + "/identity/Verus@/info?height=1", "urlText": host + "/api/" + ver + "/identity/Verus@/info?height=1"},
            {"title": "Transaction Info", "url": "/api/" + ver + "/transaction/"+tx+"/info", "urlText": host + "/api/" + ver + "/transaction/"+tx+"/info"},
        ];

        $scope.about = [
            { label: 'Blockchain Name', value: chainName },
            { label: 'Network Symbol', value: netSymbol },
            { label: 'Genesis Block', value: firstBlockStartDate.toISOString() },
            { label: 'Containerized', value: isContainerized ? '✅': '⛔️'},
            { label: 'Explorer UI Version', value: currentUiVersion, hasLink: 'https://github.com/pangz-lab/verus-explorer-ui' },
            { label: 'Explorer API Version', value: currentApiVersion, hasLink: 'https://github.com/pangz-lab/verus-explorer-api' },
            { label: 'Extras', value: extras },
        ]
    }
);
