const currentApiVersion = 'v1.0.0'
const currentUiVersion = 'v1.1.0'
const netSymbol = 'vDEX';
const chainName = "vDEX";
const firstBlockStartDate = new Date(2024, 7, 2);//Aug. 2, 2024 GMT
const isApiBound = false;
var enableContainer = '{{ENV_ENABLE_CONTAINER}}';

const defaultHost = "localhost:2220";
const testnet = false;
const allowedSearchPattern = /^[a-zA-Z0-9@]+$/;
const wsPingServerInSec = 55;
var isContainerized = enableContainer == "true";

var apiServer = isContainerized? '{{ENV_API_SERVER}}' : 'http://' + defaultHost;
var apiToken = isContainerized? '{{ENV_API_TOKEN}}' : 'dmVydXNkZXNrdG9wOnk4RDZZWGhBRms2alNoSGlSQktBZ1JDeDB0OVpkTWYyUzNLMG83ek44U28=';
var wsServer = isContainerized? '{{ENV_WS_SERVER}}' : 'ws://'+defaultHost+'/verus/wss';

var apiVersion = isContainerized? '{{ENV_API_VERSION}}' : currentApiVersion;
var uiVersion = isContainerized? '{{ENV_UI_VERSION}}' : currentUiVersion;
var extras = isContainerized? '{{ENV_TEXT_EXTRAS}}' : 'Extras 👣🦾🛀🏼 zzzZZ...';

if (isApiBound) {
  apiVersion = currentApiVersion;
  uiVersion = currentUiVersion;
  apiServer = 'http://' + defaultHost;
  wsServer = 'ws://'+defaultHost+'/verus/wss';
}
