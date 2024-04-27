'use strict';

var testnet = false;
var netSymbol = testnet ? 'VRSCTEST' : 'VRSC';
const coinpaprikaEndpointKey = "vrsc-verus-coin";
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:3001';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://api.verus.services';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-api-insight.pangz.tech'; //2223
const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-ws-insight.pangz.tech'; //2220 ws and express
const wsServer = testnet ? 'wss://wip-ws-insight.pangz.tech/verus/wss' : 'wss://wip-ws-insight.pangz.tech/verus/wss'; //2220 ws and express

// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:2220'; //2220 ws and express

// Need to secure the API token. Better put the API behind a gateway or a reverse proxy
const coinPaprikaBaseUri = 'https://api.coinpaprika.com/v1';
const apiToken =  testnet ? '' : 'Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28="';
const localStore = {
  status: { key: netSymbol + ':vexp_stats', ttl: 86400 },
  latestBlocks: { key: netSymbol + ':vexp_blocks_received', ttl: 86400 },
  latestBlockTxs: { key: netSymbol + ':vexp_txs_received', ttl: 86400 },
  nodeState: { key: netSymbol + ':vexp_chain_node_state', ttl: 86400 },
  // api: {
  //   blockchainHeight: { key: netSymbol + ':vexp_chain_height', ttl: 5 }
  // },
}

var defaultLanguage = localStorage.getItem('insight-language') || 'en';
var defaultCurrency = localStorage.getItem('insight-currency') || netSymbol;

angular.module('insight',[
  'ngAnimate',
  'ngResource',
  'ngRoute',
  'ngProgress',
  'ui.bootstrap',
  'ui.route',
  'monospaced.qrcode',
  'gettext',
  'angularMoment',
  'insight.system',
  'insight.socket',
  'insight.blocks',
  'insight.transactions',
  'insight.address',
  'insight.search',
  'insight.charts',
  'insight.status',
  // 'insight.connection',
  'insight.currency',
  // 'insight.messages',
  'insight.verusdrpc',
  'insight.verusexplorerapi',
  'insight.wseventdatamanager',
  'insight.veruswssclient',
  'insight.localstore',
  'insight.coinpaprika'
]);

angular.module('insight.system', []);
angular.module('insight.socket', []);
angular.module('insight.blocks', []);
angular.module('insight.transactions', []);
angular.module('insight.address', []);
angular.module('insight.search', []);
angular.module('insight.charts', []);
angular.module('insight.status', []);
angular.module('insight.connection', []);
angular.module('insight.currency', []);
angular.module('insight.messages', []);
angular.module('insight.verusdrpc', []);
angular.module('insight.verusexplorerapi', []);
angular.module('insight.wseventdatamanager', []);
angular.module('insight.veruswssclient', []);
angular.module('insight.localstore', []);
angular.module('insight.coinpaprika', []);
