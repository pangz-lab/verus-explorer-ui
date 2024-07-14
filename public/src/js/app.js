'use strict';
const localStore = {
  currentBlockHeight: { key: netSymbol + ':vexp_block_height', ttl: 120 },
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
  'insight.help',
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
angular.module('insight.help', []);
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
