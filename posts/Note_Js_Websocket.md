---
title: JS Websocket Basic
subtitle: Over websocket, socketJS, and STOMP
date: '2022-08-09'
label: js
---

<p class="intro">
HTTP only allows client to send requirement, server only waiting for response. To achieve dual communication, 
Websocket protocal must be introduced. Websocket protocol was defined by RFC as a <em>full duplex</em> communication channels
at layer 7 by HTML5. There are three ways of achieving websocket communication: through websocket, through socketjs, 
and STOMP.
</p>

## Websocket {#Websocket}

To debug websocket request, developerTools use network and filter WS.

To open a websocket connection:

```js
var Socket = new WebSocket(url, [protocol]);
//url: must use 'wss://' format to encrypted the data
//otherwise, if 'ws://' is used, old browser might not recognize it.
```

To check connection states:

```js
Socket.readyState
//0 connecting(not yet)
//1 open
//2 closing
//4 closed
```

To listen to 4 events:

```js
Socket.onopen//while established
Socket.onmessage//while received
Socket.onclose//while closed
Socket.onerror//while error
```

To transfer data

```js
Socket.send(body)//send string or binary
//Note: if binary, Blob or Arraybuffer.
Socket.binaryType
//Set by, and default as "blob"
```

To show buffer bytes remain to be sent

```js
Socket.bufferedAmount
//Example:
// every 100ms examine the socket and send more data
// only if all the existing data was sent out
setInterval(() => {
    if (socket.bufferedAmount == 0) {
        socket.send(moreData());
    }
}, 100);
```

To Close Socket

```js
// closing party:
socket.close(1000, "Work complete");

// the other party while on closing 1000 party
socket.onclose = event => {
    // event.code === 1000
    // event.reason === "Work complete"
    // event.wasClean === true (clean close)
};
//other code will be checked at 
// https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
```

## SocketJS {#SocketJS}

Old version of browser might not support HTML5 newly introduced method to create WebSocket object. Thus **SocketJS**
provided a "fallback" version library to create object that is similar to Websocket object.

To use SocketJS

```js
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
```

To open a SocketJS connection:

```js
var sockjs = new SockJS(url, _reserved, options);
//option 1: server(string) default 4 numbers
//option 2: transports: list of fallback
//option 3: sessionID: a random session ID
```

The others are similar to Websocket

## STOMP {#STOMP}

Specifically, while using Socket to transfer text
(STOMP: Simple/Streaming text-orientated messaging protocol), a protocol was provided, used to communicate with STOMP
message agent(broker). Of course, we can use STOMP over HTML5's Websocket by library API `stomp.js`. It's also possible
to use SocketJS as a fallback way.

To use Websocket:

```js
var StompClient = Stomp.over(WebSocket)//or SocketJS
//create STOMP over exist WebSocket object(or SocketJS object)
```

To Connect:

```js
var connectCallback = function () {
//connectCallback: when connect is successfully done,
}

var headers = {
    login: '',
    passcode: '',
    // additional header
    'client-id': 'my-client-id'
    //to include map of login and passcode
};

StompClient.connect(headers, connectCallback)
//header: map(can be empty if server not required)
//call connectCallback function
```

To Send Message:

```js
client.send("/queue/test", {priority: 9}, "Hello, STOMP");

client.send("/topic/stocks", {}, JSON.stringify(quote));
//can send string from stringify JSON object 
```

To Receive Message from subscribed destination:

```js
var callback = function () {
}
var subscription1 = client.subscribe("/queue/test", callback);
var subscription2 = client.subscribe("queue/another", callback(message));
//To subscribe to multiple destination

var quote = JSON.parse(message.body)
//can parse String back to JSON object
```

To Disconnect:

```js
  client.disconnect(function () {
    alert("See you next time!");
};
```

For more information referred to [Stomp over Websocket](http://jmesnil.net/stomp-websocket/doc/).
