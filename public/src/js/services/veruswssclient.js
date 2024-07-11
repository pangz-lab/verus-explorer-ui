angular
.module('insight.veruswssclient')
.service('VerusWssClient',
    function(
        $interval,
        $rootScope
    ) {
        var lastReceivedTime = new Date().getTime();
        var wsChannelObject = connectToWsServer();
        const wsMessageTopic = 'wsmessage';
        function conslog(m) {
            //console.log(m);
        }

        this.getMessageTopic = function() {
            return wsMessageTopic;
        }

        $interval(function() {
            if(wsChannelObject.readyState !== WebSocket.OPEN) {
                
                removeEventListeners();

                conslog('Closing the current connection ...');
                wsChannelObject.close();
                
                conslog('Opening a new one ...');
                wsChannelObject = connectToWsServer();
                return;
            }

            // If last received is less than wsPingServerInSec seconds, don't ping
            if(getLastReceivedInSeconds() > wsPingServerInSec) {
                conslog("pinging server")
                wsChannelObject.send("ping from client");
                return;
            }

            conslog("will send ping later to save bandwidth...");
        }, wsPingServerInSec * 1000);

        function getLastReceivedInSeconds() {
            const currentTime = new Date().getTime();
            const elapsedTimeInSeconds = (currentTime - lastReceivedTime) / 1000;
            conslog("Last data received : " + elapsedTimeInSeconds + ' seconds ago');
            return elapsedTimeInSeconds;
        }

        function removeEventListeners() {
            if(wsChannelObject == undefined) { return; }
            conslog('Removing event listeners...');
            wsChannelObject.removeEventListener('message', messageEventListener);
            wsChannelObject.removeEventListener('open', openEventListener);
            wsChannelObject.removeEventListener('ping', pingEventListener);
        }

        function messageEventListener (event) {
            lastReceivedTime = new Date().getTime();
            // conslog('Message from server:', event.data);
            var data = event.data.toString();
            conslog(event);
            conslog(data);
            data = JSON.parse(data);
            if(data.status != undefined) { $rootScope.$broadcast(wsMessageTopic, data); }
        };
        
        function openEventListener (event) {
            conslog('Connected to WebSocket server');
        };
        
        function pingEventListener (event) {
            conslog('Server is pinging us.');
        };

        function connectToWsServer() {
            // const socket = new WebSocket('wss://wip-ws-insight.pangz.tech/verus/wss');
            // const socket = new WebSocket('ws://localhost:2220');
            const socket = new WebSocket(wsServer);
            
            socket.addEventListener('open', openEventListener);
            socket.addEventListener('ping', pingEventListener);
            socket.addEventListener('message', messageEventListener);
            socket.addEventListener('close', function close() {
                conslog('>> WebSocket service connection closed ...');
            });

            return socket;
        }
});
