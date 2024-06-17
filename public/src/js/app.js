'use strict';

const isContainerized = true;
const isApiBound = false;

//Remove this. check usage
const testnet = false;
const netSymbol = 'VRSC';
const chainName = "Verus";
const firstBlockStartDate = new Date(2018, 5, 20);
const allowedSearchPattern = /^[a-zA-Z0-9@]+$/;
const wsPingServerInSec = 55;

var apiServer = isContainerized? '{{ENV_API_SERVER}}' : 'https://wip-ws-insight.pangz.tech'; //2220 ws and express
var apiToken = isContainerized? '{{ENV_API_TOKEN}}' : 'Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28="';
var wsServer = isContainerized? '{{ENV_WS_SERVER}}' : 'wss://wip-ws-insight.pangz.tech/verus/wss'; //2220 ws and express

// if(isContainerized) {
//   //Containerized
//   apiServer = isContainerized? '{{ENV_API_SERVER}}' : ;
//   apiToken = isContainerized? '{{ENV_API_TOKEN}}' : ;
//   wsServer = isContainerized? '{{ENV_WS_SERVER}}' : ;
// } 

if (isApiBound) {
  apiServer = 'http://localhost:2220'; //2220 ws and express
  wsServer = 'ws://localhost:2220/verus/wss'; //2220 ws and express
}

// const apiServer = 'http://localhost:2220'; //2220 ws and express
// const wsServer = 'ws://localhost:2220/verus/wss'; //2220 ws and express

// Need to secure the API token. Better put the API behind a gateway or a reverse proxy
// const coinpaprikaEndpointKey = "vrsc-verus-coin";
// const coinPaprikaBaseUri = 'https://api.coinpaprika.com/v1';
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
      last100: { key: netSymbol + ':vexp_chart_last100', ttl: 600 },//10 min
      last250: { key: netSymbol + ':vexp_chart_last250', ttl: 600 },//10 min
      last500: { key: netSymbol + ':vexp_chart_last500', ttl: 1800 },//30 min
      last1000: { key: netSymbol + ':vexp_chart_last1000', ttl: 3600 },//1 hr
      last1250: { key: netSymbol + ':vexp_chart_last1250', ttl: 3600 },//1 hr
      last1500: { key: netSymbol + ':vexp_chart_last1500', ttl: 7200 },//2 hr
    }
  },
}
const chart = {
  types: {
    miningbasicinfo: { apiName: 'miningbasicinfo' },
    chainbasicinfo: { apiName: 'chainbasicinfo' },
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
  // 'insight.socket',
  'insight.blocks',
  'insight.transactions',
  'insight.address',
  'insight.search',
  'insight.charts',
  'insight.status',
  // 'insight.connection',
  'insight.currency',
  // 'insight.messages',
  // 'insight.verusdrpc',
  'insight.verusexplorerapi',
  'insight.wseventdatamanager',
  'insight.veruswssclient',
  'insight.localstore',
  'insight.coinpaprika'
  // 'chart.js'
]);

angular.module('insight.system', []);
// angular.module('insight.socket', []);
angular.module('insight.blocks', []);
angular.module('insight.transactions', []);
angular.module('insight.address', []);
angular.module('insight.search', []);
angular.module('insight.charts', [])
angular.module('insight.status', []);
// angular.module('insight.connection', []);
angular.module('insight.currency', []);
// angular.module('insight.messages', []);
// angular.module('insight.verusdrpc', []);
angular.module('insight.verusexplorerapi', []);
angular.module('insight.wseventdatamanager', []);
angular.module('insight.veruswssclient', []);
angular.module('insight.localstore', []);
angular.module('insight.coinpaprika', []);
// angular.module('chart.js', []);
