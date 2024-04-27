'use strict';

angular.module('insight.transactions')
.controller('TransactionsController',
    function (
        $scope,
        $rootScope,
        $routeParams,
        $location,
        Global,
        VerusExplorerApi
    ) {
        $scope.global = Global;
        $scope.loading = true;
        $scope.loadedBy = null;
        $scope.addressTxCount = 0;

        var txVoutTotalValue = 0;
        var txVinTotalValue = 0;

        var _aggregateItems = function (items, callback) {
            if (!items) return [];
            var l = items.length;
            for (var i = 0; i < l; i++) {
                callback(items, i);
            }
        };

        var _processTX = function (tx, currentBlockHeight) {
            console.log("VIN >>");
            txVinTotalValue = 0;
            txVoutTotalValue = 0;
            addressCommitments = {};
            const hasVin = tx.vin != undefined && tx.vin[0] != undefined;
            // const hasVout = tx.vout != undefined && tx.vout[0] != undefined;
            ///////////////////////////////////
            // vin operation
            ///////////////////////////////////
            _aggregateItems(tx.vin == undefined ? [] : tx.vin, function (items, i) {
                items[i].uiWalletAddress = (typeof (items[i].addresses) === "object")
                    ? items[i].addresses[0]
                    // Older TXs
                    : items[i].address;

                txVinTotalValue += items[i].value;
            });

            ///////////////////////////////////
            // vout operation
            ///////////////////////////////////
            _aggregateItems(tx.vout, function (items, i) {
                // console.log(typeof(items[i].scriptPubKey.addresses));
                const addressType = typeof (items[i].scriptPubKey.addresses);
                const pubKeyAddressess = items[i].scriptPubKey.addresses ? items[i].scriptPubKey.addresses : [];
                var isIdentityTx = false;
                var identityPrimaryName = "";
                var uiWalletAddress = "";

                if (addressType === "object" && items[i].scriptPubKey.identityprimary) {
                    // VerusID transaction
                    // Get the first primary address
                    isIdentityTx = true;
                    uiWalletAddress = items[i].scriptPubKey.identityprimary.primaryaddresses[0];
                    identityPrimaryName = items[i].scriptPubKey.identityprimary.name + '@';

                } else if (addressType === "object") {
                    // Array of addresses - get the first one
                    uiWalletAddress = pubKeyAddressess[0];
                } else {
                    uiWalletAddress = pubKeyAddressess.join(",");
                }


                tx.vout[i].uiWalletAddress = uiWalletAddress[0] == undefined ? ' [ NO ADDRESS ] ' : uiWalletAddress;
                tx.vout[i].isSpent = items[i].spentTxId;
                tx.vout[i].multipleAddress = pubKeyAddressess.join(',');
                tx.vout[i].identityTxTypeLabel = "...";
                tx.vout[i].othercommitment = _getOtherTxCommitment(items[i].scriptPubKey);
                tx.vout[i].pbaasCurrencies = _getPbaasCommitment(items[i].scriptPubKey);
                tx.vout[i].isPbaasCurrencyExist = tx.vout[i].pbaasCurrencies[0] != undefined;

                txVoutTotalValue += items[i].value;

                if (isIdentityTx) {
                    VerusExplorerApi
                    .getIdentity(identityPrimaryName, tx.height)
                    .then(function (idInfo) {
                        const data = idInfo.data;
                        tx.vout[i].identityTxTypeLabel = (data.result) ? "📇 Verus ID Mutation" : "🪪 Identity Commitment";
                    });
                }
            });


            // New properties calculated manually
            tx.confirmations = tx.height ? currentBlockHeight - tx.height + 1 : 0;
            tx.size = tx.hex.length / 2;
            txVoutTotalValue = parseFloat(txVoutTotalValue);
            tx.valueOut = txVoutTotalValue.toFixed(8);
            tx.isNewlyCreatedCoin = hasVin && tx.vin[0].coinbase != undefined;
            tx.shieldedSpend = [];
            tx.shieldedOutput = [];

            if (tx.overwintered && tx.version >= 4) {
                tx.shieldedSpend = tx.vShieldedSpend;
                tx.shieldedOutput = tx.vShieldedOutput;
            }

            tx.fees = parseFloat((txVinTotalValue - txVoutTotalValue).toFixed(8));
            if (tx.valueBalance != undefined) {
                if (tx.vout[0] == undefined) {
                    tx.fees = parseFloat((tx.valueBalance + txVinTotalValue).toFixed(8));
                } else if (tx.vin[0] == undefined) {
                    tx.fees = parseFloat((tx.valueBalance - txVoutTotalValue).toFixed(8));
                } else {
                    tx.fees = parseFloat(((txVinTotalValue - txVoutTotalValue) + tx.valueBalance).toFixed(8));
                }
            }

            // TODO
            // 2. Update full view for transaction
            // 3. fix sequence or just remove the tx counter? http://localhost:2222/address/iLAZzpXuQpapbysYzLNUDLbpLuGr6NwhbH
        };

        var _getPbaasCommitment = function (scriptPubKey) {
            if (scriptPubKey.reserve_balance == undefined) {
                return [];
            }
            var pbaasBalances = [];
            const currencies = Object.entries(scriptPubKey.reserve_balance);
            for (var i = 0; i < currencies.length; i++) {
                const currency = currencies[i];
                pbaasBalances.push(currency[1] + ' ' + currency[0]);
            }
            return pbaasBalances;
        }

        var _getOtherTxCommitment = function (scriptPubKey) {
            if (scriptPubKey.crosschainimport) return '📥 crosschainimport';
            if (scriptPubKey.crosschainexport) return '📤 crosschainexport';
            if (scriptPubKey.identitycommitment) return scriptPubKey.identitycommitment;
            if (scriptPubKey.reservetransfer) return '💱 reservetransfer';
            if (scriptPubKey.pbaasNotarization) return '⛓ pbaasNotarization';
            return '';
        }


        //////////////////////////////////////////////////////////////////////////
        // Common method for transaction and address pages
        //////////////////////////////////////////////////////////////////////////
        var _findTx = function (txid) {
            // TODO - improve this.
            // reduce getBlockCount call, add cooldown time based on the last request
            // localstorage can be used
            VerusExplorerApi
            .getBlockchainHeight()
            .then(function (blockHeight) {
                VerusExplorerApi
                .getTransactionInfo(txid)
                .then(function (rawTx) {
                    const blockData = blockHeight.data;
                    const rawTxData = rawTx.data; 
                    // console.log(" GETTING >>>");
                    // console.log(blockData);
                    // console.log(rawTxData);
                    $rootScope.flashMessage = null;
                    _processTX(rawTxData, blockData);
                    $scope.tx = rawTxData;
                    
                    // Used for address page only(not for transaction page)
                    rawTxData.timing = new Date(rawTxData.time).getTime();
                    $scope.txs.push(rawTxData);
                })
                .catch(function (e) {
                    if (e.status === 400) {
                        $rootScope.flashMessage = 'Invalid Transaction ID: ' + $routeParams.txId;
                    } else if (e.status === 503) {
                        $rootScope.flashMessage = 'Backend Error. ' + e.data;
                    } else {
                        $rootScope.flashMessage = 'Transaction Not Found';
                    }

                    $location.path('/');
                });

            });
        };


        //////////////////////////////////////////////////////////////////////////
        // Address page helper methods
        //////////////////////////////////////////////////////////////////////////
        const MAX_ITEM_PER_SCROLL = 5;
        // const START_TX_INDEX_OFFSET = 2;
        $scope.isGettingAllTx = true;
        // One item is preloaded after getting all the txs so index 0 is already occupied
        $scope.startTransactionIndex = null;
        $scope.preProcessedTxIds = [];
        $rootScope.addressPage = { transactionCount: 0 }

        var _getAllAddressTxs = function () {
            $scope.isGettingAllTx = true;
            $scope.hasTxFound = false;
            $scope.loading = true;

            VerusExplorerApi
            .getAddressTxIds($routeParams.addrStr)
            .then(function (txIds) {
                const data = txIds.data;
                $scope.preProcessedTxIds = data;
                $scope.addressTxCount = data.length;
                $scope.hasTxFound = data[0];

                $scope.startTransactionIndex = data.length - 1;
                _paginate(
                    _getLastNElements(
                        $scope.preProcessedTxIds,
                        $scope.startTransactionIndex,
                        MAX_ITEM_PER_SCROLL));

                $rootScope.addressPage = { transactionCount: $scope.preProcessedTxIds.length };
                $scope.isGettingAllTx = false;
            });
        }

        var _getAllBlockTxs = function (hashes) {
            $scope.isGettingAllTx = true;
            $scope.hasTxFound = false;
            $scope.blockTxCount = hashes.length;
            // $scope.hasTxFound = false;

            // VerusdRPC.getAddressTxIds([$routeParams.addrStr])
            // .then(function(data) {
            //   $scope.preProcessedTxIds = data.result;
            //   $scope.hasTxFound = data.result[0];
            //   // Decremented in _findTx method
            //   startIndexLabel = $scope.preProcessedTxIds.length + 1;

            //   $scope.startTransactionIndex = data.result.length - 1;
            //   _paginate(_getLastNElements($scope.preProcessedTxIds, $scope.startTransactionIndex, MAX_ITEM_PER_SCROLL));


            //   $rootScope.addressPage = { transactionCount: $scope.preProcessedTxIds.length };
            //   $scope.isGettingAllTx = false;
            // });
            // console.log("hashes >>>");
            // console.log(hashes);

            // startIndexLabel = $scope.preProcessedTxIds.length + 1;
            $scope.preProcessedTxIds = hashes;
            $scope.startTransactionIndex = hashes.length - 1;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL));

            $scope.isGettingAllTx = false;
            $scope.hasTxFound = hashes[0];
        }

        // TODO, put in a service
        var _getLastNElements = function (a, start, count) {
            var x = 0;
            var result = [];
            for (var i = start; i >= 0; i--) {
                if (x == count) { break; }
                result.push(a[i]);
                x += 1;
            }
            // console.log(result);
            return result;
        }

        var _byBlock = function () {
            $scope.startTransactionIndex = $scope.startTransactionIndex - MAX_ITEM_PER_SCROLL;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL
                ));

            $scope.loading = false;
        };

        var _byAddress = function () {
            $scope.startTransactionIndex = $scope.startTransactionIndex - MAX_ITEM_PER_SCROLL;
            _paginate(
                _getLastNElements(
                    $scope.preProcessedTxIds,
                    $scope.startTransactionIndex,
                    MAX_ITEM_PER_SCROLL));

            $scope.loading = false;
        };


        var _paginate = function (data) {
            pagesTotal = data.length;
            // pageNum += 1;

            // data.txs.forEach(function(tx) {
            //startIndexLabel = txStart
            // console.log(data);
            data.forEach(function (tx) {

                // startIndexLabel -= 1;  
                _findTx(tx);
                // const lastTx = $scope.tx;
                // $scope.txs.push(lastTx);
                // $scope.txIndexLabel[lastTx.time] = (startIndexLabel -= 1);
                // $scope.txs.push(tx);
            });
            $scope.loading = false;
        };


        $scope.findThis = function () {
            _findTx($routeParams.txId);
        };

        //Initial load
        $scope.load = function (from, hashes) {
            $scope.loadedBy = from;
            // if($scope.preProcessedTxIds[0] == undefined) {
            if ($scope.loadedBy === 'address') {
                _getAllAddressTxs();
            } else {
                // console.log("hashes >>>");
                // console.log(hashes);
                _getAllBlockTxs(hashes);
                // _paginate(_getLastNElements($scope.preProcessedTxIds, $scope.startTransactionIndex, MAX_ITEM_PER_SCROLL));
            }
            // }
            $scope.loadMore();
        };

        //Load more transactions for pagination
        $scope.loadMore = function () {
            // if (pageNum < pagesTotal && !$scope.loading) {

            if ($scope.loadedBy === 'address') {
                _byAddress();
                // $scope.loading = false;
            } else {
                _byBlock();
            }
            // }
        };

        // Highlighted txout

        if ($routeParams.v_type == '>' || $routeParams.v_type == '<') {
            $scope.from_vin = $routeParams.v_type == '<' ? true : false;
            $scope.from_vout = $routeParams.v_type == '>' ? true : false;
            $scope.v_index = parseInt($routeParams.v_index);
            // console.log("v_index >>> ");
            // console.log($scope.from_vin);
            // console.log($scope.v_index);

            $scope.itemsExpanded = true;
        }

        //Init without txs
        $scope.txs = [];
        // If there's a memory issue, this can be removed.
        // This only serves as the index counter in each tx card
        $scope.txIndexLabel = {};

        $scope.$on('tx', function (event, txid) {
            _findTx(txid);
        });

    }
);


angular.module('insight.transactions').controller('SendRawTransactionController',
    function ($scope, $http) {
        $scope.transaction = '';
        $scope.status = 'ready';  // ready|loading|sent|error
        $scope.txid = '';
        $scope.error = null;

        $scope.formValid = function () {
            return !!$scope.transaction;
        };
        $scope.send = function () {
            var postData = {
                rawtx: $scope.transaction
            };
            $scope.status = 'loading';
            $http.post(window.apiPrefix + '/tx/send', postData)
                .success(function (data, status, headers, config) {
                    if (typeof (data.txid) != 'string') {
                        // API returned 200 but the format is not known
                        $scope.status = 'error';
                        $scope.error = 'The transaction was sent but no transaction id was got back';
                        return;
                    }

                    $scope.status = 'sent';
                    $scope.txid = data.txid;
                })
                .error(function (data, status, headers, config) {
                    $scope.status = 'error';
                    if (data) {
                        $scope.error = data;
                    } else {
                        $scope.error = "No error message given (connection error?)"
                    }
                });
        };
    }
);
