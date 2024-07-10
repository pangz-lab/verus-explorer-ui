'use strict';

angular
.module('insight.help')
.controller('HelpController',
    function ($scope) {
        const host = apiServer;
        const address = "RP9tNCn6LHEYS7Yrp3NVuSu7DJZjAW6GyT";
        const tx = "57fc2c458fd27ab212e23feebcd14f2f2a9de16bff413d8e11402dfdb0c5bdcc";
        $scope.apis = [
            {"title": "Block Info", "url": host + "/api/block/3000000/info", "urlText": host + "/api/block/3000000/info"},
            {"title": "Blockchain Height", "url": host + "/api/blockchain/height", "urlText": host + "/api/blockchain/height"},
            {"title": "Blockchain Status", "url": host + "/api/blockchain/status", "urlText": host + "/api/blockchain/status"},
            {"title": "Blockchain Info", "url": host + "/api/blockchain/info", "urlText": host + "/api/blockchain/info"},
            {"title": "Blockchain Mining Info", "url": host + "/api/blockchain/mining/info", "urlText": host + "/api/blockchain/mining/info"},
            {"title": "Transaction Info", "url": host + "/api/transaction/"+tx+"/info", "urlText": host + "/api/transaction/"+tx+"/info"},
            {"title": "Identity Info", "url": host + "/api/identity/Verus@/info?height=3000000", "urlText": host + "/api/identity/Verus@/info?height=3000000"},
            {"title": "Address Balance", "url": host + "/api/address/"+address+"/balance", "urlText": host + "/api/address/"+address+"/balance"},
            {"title": "Address Tx IDs", "url": host + "/api/address/"+address+"/txids?maxHeight=3000000", "urlText": host + "/api/address/"+address+"/txids?maxHeight=3000000"},
        ];
    }
);
