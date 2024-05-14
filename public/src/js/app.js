'use strict';

var testnet = false;
var netSymbol = testnet ? 'VRSCTEST' : 'VRSC';
const chainName = "Verus";
const coinpaprikaEndpointKey = "vrsc-verus-coin";
const firstBlockStartDate = new Date(2018, 4, 20);
const allowedSearchPattern = /^[a-zA-Z0-9@]+$/;
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:3001';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://api.verus.services';
// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-api-insight.pangz.tech'; //2223
const apiServer = testnet ? 'http://127.0.0.1:27486' : 'https://wip-ws-insight.pangz.tech'; //2220 ws and express
const wsServer = testnet ? 'wss://wip-ws-insight.pangz.tech/verus/wss' : 'wss://wip-ws-insight.pangz.tech/verus/wss'; //2220 ws and express
// const wsServer = testnet ? 'wss://wip-ws-insight.pangz.tech/verus/wss' : 'ws://localhost:2220/verus/wss'; //2220 ws and express

// const apiServer = testnet ? 'http://127.0.0.1:27486' : 'http://localhost:2220'; //2220 ws and express

// Need to secure the API token. Better put the API behind a gateway or a reverse proxy
const coinPaprikaBaseUri = 'https://api.coinpaprika.com/v1';
const apiToken =  testnet ? '' : 'Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28="';
const localStore = {
  status: { key: netSymbol + ':vexp_stats', ttl: 86400 },
  latestBlocks: { key: netSymbol + ':vexp_blocks_received', ttl: 86400 },
  latestBlockTxs: { key: netSymbol + ':vexp_txs_received', ttl: 86400 },
  nodeState: { key: netSymbol + ':vexp_chain_node_state', ttl: 86400 },
  charts: {
    keys: {
      last10Minutes: { key: netSymbol + ':vexp_chart_last10Minutes', ttl: 60 }, //1 min
      last30Minutes: { key: netSymbol + ':vexp_chart_last30Minutes', ttl: 120 }, //2 min
      lastHour: { key: netSymbol + ':vexp_chart_lastHour', ttl: 600 }, //10 min
      last3Hours: { key: netSymbol + ':vexp_chart_last3Hours', ttl: 600 }, //10 min
      last6Hours: { key: netSymbol + ':vexp_chart_last6Hours', ttl: 1800 }, //30 min
      last12Hours: { key: netSymbol + ':vexp_chart_last12Hours', ttl: 1800 },//30 min
      last24Hours: { key: netSymbol + ':vexp_chart_last24Hours', ttl: 43200 },//12 hr
      last3Days: { key: netSymbol + ':vexp_chart_last3Days', ttl: 43200 },//12 hr
      last7Days: { key: netSymbol + ':vexp_chart_last7Days', ttl: 86400 },//24 hr
      last15Days: { key: netSymbol + ':vexp_chart_last15Days', ttl: 86400 },//24 hr
      last30Days: { key: netSymbol + ':vexp_chart_last30Days', ttl: 86400 },//24 hr
      last90Days: { key: netSymbol + ':vexp_chart_last90Days', ttl: 86400 },//24 hr
      
      last10: { key: netSymbol + ':vexp_chart_last10', ttl: 120 },//2 min
      last50: { key: netSymbol + ':vexp_chart_last50', ttl: 120 },//2 min
      last100: { key: netSymbol + ':vexp_chart_last100', ttl: 600 },//10 hr
      last500: { key: netSymbol + ':vexp_chart_last500', ttl: 600 },//10 hr
    }
  },
  // api: {
  //   blockchainHeight: { key: netSymbol + ':vexp_chain_height', ttl: 5 }
  // },
}
const chart = {
  types: {
    txOverTime: { apiName: 'txovertime' },
    blockBasicInfo: { apiName: 'blkbasicinfo' }
  }
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
  // 'chart.js'
]);

angular.module('insight.system', []);
angular.module('insight.socket', []);
angular.module('insight.blocks', []);
angular.module('insight.transactions', []);
angular.module('insight.address', []);
angular.module('insight.search', []);
angular.module('insight.charts', [])
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
// angular.module('chart.js', []);
