const isContainerized = false;
const isApiBound = false;

const testnet = false;
const netSymbol = 'VRSC';
const chainName = "Verus";
const firstBlockStartDate = new Date(2018, 5, 20);
const allowedSearchPattern = /^[a-zA-Z0-9@]+$/;
const wsPingServerInSec = 55;
const currentApiVersion = '0.0.1'

var apiVersion = isContainerized? '{{ENV_API_VERSION}}' : currentApiVersion; //2220 ws and express
var apiServer = isContainerized? '{{ENV_API_SERVER}}' : 'https://wip-ws-insight.pangz.tech'; //2220 ws and express
var apiToken = isContainerized? '{{ENV_API_TOKEN}}' : 'Basic dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28="';
var wsServer = isContainerized? '{{ENV_WS_SERVER}}' : 'wss://wip-ws-insight.pangz.tech/verus/wss'; //2220 ws and express

if (isApiBound) {
  apiVersion = currentApiVersion;
  apiServer = 'http://localhost:2220';
  wsServer = 'ws://localhost:2220/verus/wss';
}
