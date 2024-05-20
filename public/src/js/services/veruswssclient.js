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

        this.getMessageTopic = function() {
            return wsMessageTopic;
        }

        $interval(function() {
            if(wsChannelObject.readyState !== WebSocket.OPEN) {
                
                removeEventListeners();

                console.log('Closing the current connection ...');
                wsChannelObject.close();
                
                console.log('Opening a new one ...');
                wsChannelObject = connectToWsServer();
                return;
            }

            // If last received is less than 30 seconds, don't ping
            if(getLastReceivedInSeconds() > 30) {
                console.log("pinging server")
                wsChannelObject.send("ping from client");
                return;
            }

            console.log("will send ping later to save bandwidth...");
        }, 30000);

        function getLastReceivedInSeconds() {
            const currentTime = new Date().getTime();
            const elapsedTimeInSeconds = (currentTime - lastReceivedTime) / 1000;
            console.log("Last data received : " + elapsedTimeInSeconds + ' seconds ago');
            return elapsedTimeInSeconds;
        }

        function removeEventListeners() {
            if(wsChannelObject == undefined) { return; }
            console.log('Removing event listeners...');
            wsChannelObject.removeEventListener('message', messageEventListener);
            wsChannelObject.removeEventListener('open', openEventListener);
            wsChannelObject.removeEventListener('ping', pingEventListener);
        }

        function messageEventListener (event) {
            lastReceivedTime = new Date().getTime();
            // console.log('Message from server:', event.data);
            var data = event.data.toString();
            console.log(event);
            console.log(data);
            data = JSON.parse(data);
            if(data.status != undefined) { $rootScope.$broadcast(wsMessageTopic, data); }
        };
        
        function openEventListener (event) {
            console.log('Connected to WebSocket server');
        };
        
        function pingEventListener (event) {
            console.log('Server is pinging us.');
        };

        function connectToWsServer() {
            // const socket = new WebSocket('wss://wip-ws-insight.pangz.tech/verus/wss');
            // const socket = new WebSocket('ws://localhost:2220');
            const socket = new WebSocket(wsServer);
            
            socket.addEventListener('open', openEventListener);
            socket.addEventListener('ping', pingEventListener);
            socket.addEventListener('message', messageEventListener);
            socket.addEventListener('close', function close() {
                console.log('>> WebSocket service connection closed ...');
            });

            return socket;
        }
});
