---
title: Few Notes about Javascript and Websocket
date: '2022-08-09'
label: js
---
# DiceRolling Client Server Design Note

by Yuxuan Yang

Table of Contents

1. [1. Communication Mode](#1-communication-mode)
2. [2. Websocket SocketJS and STOMP](#2-websocket-socketjs-and-stomp)
    1. [2.1 Websocket](#21-websocket)
    2. [2.2 SocketJS](#22-socketjs)
    3. [2.3 STOMP](#23-stomp)
    4. [2.4 broadcast](#24-broadcast-way)
3. [3. (Server)Websocket with Java SpringBoot](#3-websocket-with-java-springboot)
    1. [3.0 Message, Server, Servlet, Request, Response](#30-message-server-servlet-request-response)
        1. [3.0.1 JavaEE Servlets](#301-javaee-servlets)
        2. [3.0.2 Apache Http Components Library](#302-apache-http-components-library)
    2. [3.1 configureMessageBroker](#31-configuremessagebroker)
    3. [3.2 registerStompEndpoints](#32-registerstompendpoints)
    4. [3.3 EventListener and HeadAccessor](#33-eventlistener-and-headaccessor)
    5. [3.4 Scheduling](#34-scheduling)
    6. [3.5 Interceptor](#35-interceptor)
        1. [3.5.1 Channel Interceptor](#351-channel-interceptor)
        2. [3.5.2 Session](#352-session)
        3. [3.5.3 Handshake Interceptor](#353-handshake-interceptor)
4. [4. (Server)Game Server Design](#4-game-server-design)
5. [5. (Client)Game Client Design](#5-game-client-design)
    1. [5.1 Few problems on JS](#51-few-problems-on-js)
        1. [5.1.1 `__proto__` & `prototype` & `constructor`](#511-__proto__--prototype--constructor)
        2. [5.1.2 5.1.2 `this` in JS](#512-this-in-js)
        3. [5.1.3 Closure](#513-closure)

## 1. Communication Mode

A very essential part in designing webgame is to keep information synchronized between both "Server and Client" and "
Client and Client". For game that requires strong dynamic time control will choose **frame sync**, while turn-based game
will prefer **state sync**.

> Frame Sync Structure:
> Server defined sequence in time,
> within a time sequence,
> client must submit current state to server,
> then server broadcast new state to all connected client

> State Sync:
> Client send one state to Server,
> and Server broadcast to other client while Client do something.
> No serious time sequence control.

In this game, we choose the approach of State Sync since the player will only do action one by one in their turn.

## 2. Websocket SocketJS and STOMP

HTTP only allows client to send requirement, server only waiting for response. To achieve dual communication, **
Websocket protocal** must be introduced. Websocket protocol was defined by RFC as a *full duplex* communication channels
at layer 7 by HTML5.

### 2.1 Websocket

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

### 2.2 SocketJS

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

### 2.3 STOMP

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

### 2.4 Broadcast Way

- Unicast: point to point
- Broadcast: everyone
- Multicast: point to Groups

## 3. Websocket With Java Springboot

Websocket has two Functionalities that can be use:

* **Event Methods**, that trigger event within Websocket, such as :
  CONNECT, SEND, CLOSE...
* **Listener Methods**, that listen for events that has been triggered, such as : OnOpen, OnConnect, OnClose...

The supportive document: [WebSockets API Document](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

Springboot has `WebSocketMessageBrokerConfigurer`
to provide the method of Endpoint and broker configuration, as well as Interceptor and EventListener for Websocket.

* The annotation `@EnableWebSocketMessageBroker`defined **class** of configuration.
* `configureMessageBroker(MessageBrokerRegistry config)` function configure broker
* `registerStompEndpoints(StompEndpointRegistry registry)` function configure message Endpoint
* `HandshakeInterceptor` and `ChannelInterceptor` define before and after handshake interceptor
* `EventListener` after handshake on four events.

### 3.0 Message, Server, Servlet, Request, Response

Historically, there're two parallel package to hold HTTP Request/Response:

* JavaEE Servlets(comes first)
* Apache Http Components Library

The JavaEE Servlets contains `HttpServletRequest` and `HttpServletResponse`, comparably Apache has `HttpRequest`
and `HttpResponse`.

#### 3.0.1 JavaEE Servlets

_Servlets_ run in a servlet container, which the well known one might be **Tomcat**. It is a Java object to handle Http
Request.

`HttpServletRequest` and `HttpServletResponse` are server-side class, extended from `ServletRequest`
and `ServletResponse` respectively. When implementing servlets, one must use JavaEE's rather than
Apache's.  `ServletRequest` and `ServletResponse` provide three part:
_HTTP Servlet_, _Body_ and _Headers_.

> `HttpServletRequest`<--(extends)--`ServletRequest`

> `HttpServletResponse`<--(extends)--`ServletResponse`

Similary, two other things `HttpInputMessage` and `HttpOutputMessage` only has _Body_ and _Headers_,
while `HttpInputMessage` need extra **METHOD** in it's header.
`HttpMessage` defines the commonly used getHeader() method to get HTTP header except METHOD, and the Body is got
respectively by their own methods, as shown below:
> `HttpMessage`<---`HttpHeaders getHeader()`<---`MultiValueMap`<---`Map`

> `HttpInputMessage`<--(extends)--`HttpMessage`

> `HttpOutputMessage`<--(extends)--`HttpMessage`

#### 3.0.2 Apache Http Components Library

For the request header,`HttpRequest`need extra **METHOD**
thus `getHeader()` extends from `HttpMessage` as usual, while `getMethod()` defined by itself.

> `HttpRequest`<--(extends)--`HttpMessage`

A Server side representation is `ServerHttpRequest` and based on both JavaEE's `HttpInputMessage` and
Apache's `HttpRequest`.

A Whole combination of them is `ServletServerHttpRequest`, which is server-side, contains both
JavaEE's `ServletRequest` `HttpInputMessage` and Apache's `HttpRequest`.
![](11334c891bce53db804563c4a1d9a744.png)

### 3.1 configureMessageBroker

To config Broker prefix

```java
config.enableSimpleBroker("/prefix_url");
//config the prefix of Client subscription
//Client will subscribe to "/prefix_url/**"

        config.setApplicationDestinationPrefixes("/prefix_url")
//config the prefix of Server received mapping destination
//Note that Client will send to "/prefix_url/**"
//while @MessageMapping will receive at "/**" without "/prefix_url"
```

To receive message in controller

```java
@MessageMapping('/url')
//url: the destination without prefix that configured in setApplicationDestinationPrefixes
```

To send message to Client from controller,

- two ways:
    - use `@SendTo` annotation programming
    - use `SimpMessagingTemplate` in a Service

`@SendTo` annotation will **Broadcast** to all user page that can access to the url, while `SimpMessagingTemplate`
provides more methods to support other **Unicast** to user or **Multicast** to groups.

For example, if one want to **Broadcast** information:
> JS: subscribe to single url

```js
stompClient.subscribe('/url

function (...) {...
```

> Spring: send object to all the url by @SendTo

```java
@SendTo('/url')
public myObject send(...){
        ...
        return myObject
        }
```

For example, if one want to **Unicast** to one's special channel.
> HTML: If we need to access model value from thymeleaf in JS, we must store it firstly in HTML, possibly with hidden value, shown below

```html
<input type="hidden" id="myid" th:value="${myid}"/>
<!--hidden way to store value in model-->
```

> JS: subscribe to my special channel use my id stored in HTML, shown below

```js
var my_id = ${#myid}
}.
val()
stompClient.subscribe('/url/' + my_id,
    function (...) {...
```

> Spring: using SimpMessagingTemplate(can be wrapped in Service) to send to special url

```java
SimpMessagingTemplate.convertAndSend("/url/"+myid,content);
```

### 3.2 registerStompEndpoints

Endpoint was used to create STOMP websocket. For example, we can create STOMP over SocketJS as below:

```java
//Java Spring @Override registerStompEndpoints
StompEndpointRegistry.addEndpoint("/endpoint_url").withSockJS();
//.withSockJS() will enable SocketJS way of Object
```

```js
//javascript
var socket = new SockJS('/endpoint_url');
stompClient = Stomp.over(socket);
```

### 3.3 EventListener and HeadAccessor

Springboot has `ApplicationListener<>` to provide the method of listen on 4 Websocket events. For example:

* `ApplicationListener<SessionConnectEvent>` provide connect event listener
* ...
* other's can check SessionEvent abstract class AbstractSubProtocolEvent

The event's header can be accessed by `StompHeaderAccessor`.
`StompHeaderAccessor` can access header's information such as:

* header type(connect, subscribe)
* sessionID
* ...

For example:

```java
StompHeaderAccessor headerAccessor=StompHeaderAccessor.wrap(sessionConnectEvent.getMessage());
//the event header sessionConnectEvent.getMessage()
//headerAccessor has information of headers
```

### 3.4 Scheduling

To regularly run we need to add annotation `@EnableScheduling`in front of Spring main function.

Note that If method was scheduled, it should not have any parameter.

### 3.5 Interceptor

After adding interceptor on Websocket, the message now is passing through the way as:
> `message`--->`HandshakeInterceptor`--->`ChannelInterceptor`

#### 3.5.1 Channel Interceptor

Spring use `Message` to represent information with header and payload, and it was sent through `MessageChannel`
. `ChannelInterceptor` provides a way to capture information before and after `Message` is sending through channel, and
we can configure it through it's inplementation(see `ChannelInterceptor` Interface).

Note that if messages are comming from Websocket, we also need to register interceptor in Websocket Configuration
through implementation of `WebSocketMessageBrokerConfigurer`
by override corresponding methods, as following:

```java
@Override
public void configureClientInboundChannel(ChannelRegistration registration){
        WebSocketMessageBrokerConfigurer.super.configureClientInboundChannel(registration);
        registration.interceptors(new SocketChannelInteceptor());
        }
@Override
public void configureClientOutboundChannel(ChannelRegistration registration){
        WebSocketMessageBrokerConfigurer.super.configureClientOutboundChannel(registration);
        registration.interceptors(new SocketChannelInteceptor());
        }
```

#### 3.5.2 Session

Http Session, is defined as a series of related browser requests that come from the same client during a certain time
period. Session tracking ties together a series of browser requests—think of these requests as pages—that may have some
meaning as a whole, such as a shopping cart application.

Session will be created by `HttpServletRequest` as following:

```java
public servletRequest(HttpServletRequest request){
        request.getSession();
        //Returns the current session associated with this request, 
        // or if the request does not have a session, creates one.
        request.getSession(false);
        //Returns the current session, if not, return Null
        request.getSession(true);
        //Returns the current session, if not, create one
        }
```

Session can be easily approached by `HttpSession` as controller parameter

```java
@GetMapping
public sessionController(HttpSession httpsession){
        httpsession.getID()
        //get sessionID
        httpsession.setAttributes("name",value);
        //add attributes in this session
        httpsession.getAttributes("name");
        //get pre-saved attributes from this session 
        }
```

#### 3.5.3 Handshake Interceptor

By adding HandshakeInterceptor,one can prevent user's entering from unauthorized condition, note that
HandshakeInterceptor can be registered directly with Endpoint.

```java
//Java Spring @Override registerStompEndpoints
StompEndpointRegistry
        .addEndpoint("/endpoint_url")
        .addInterceptors(new Interceptor())
        .withSockJS();
```

The HandshakeInterceptor, which has two method to override: `beforeHandshake` and `afterHandshake`. In `beforeHandshake`
, we can also fetch necessary information and put them into
`Map<String, Object> attributes`, and get the value at other position such as
`StompHeaderAccessor.getSessionAttribute().get()`.

For session id, as we mentioned in
[3.0.2 Apache Http Components Library](#302-apache-http-components-library), since only `ServletServerHttpRequest` has
method ".getServletRequest()", but the override handshake are using `ServerHttpRequest` which does not contain Servlet
information, as well as it's rather impossible to get `HttpServletRequest`
from `ServerHttpRequest`, we need to firstly convert `ServerHttpRequest` to `ServletServerHttpRequest`.

```java
@Override
public boolean beforeHandshake(ServerHttpRequest request,ServerHttpResponse response,WebSocketHandler wsHandler,Map<String, Object> attributes)throws Exception{
        if(request instanceof ServletServerHttpRequest){
        //if request exist
        ServletServerHttpRequest servletServerHttpRequest=(ServletServerHttpRequest)request;
        //get ServletServerHttpRequest from ServerHttpRequest
        HttpSession session=servletServerHttpRequest.getServletRequest().getSession();
        //get Session from ServletRequest
        String sessionId=session.getId();
        //Get Session id from Session
        attributes.put("sessionID",sessionId);
        //Add sessionID into attributes
        }
        return true;
        }
```

and at any four events, the listener can get SessionID from `StompHeaderAccessor` by

```java
StompHeaderAccessor headerAccessor=StompHeaderAccessor.wrap(event.getMessage());
        headerAccessor.getSessionAttributes().get("sessionID");
```

## 4. Game Server Design

There are normally two ways to design game server:

* **Local Player Hosted Gamer Servers**, server run client side, and game communication throw "server-to-server", for
  example, Minecraft. Each server holds a game session to allow other server as players to join in.
* **Cloud Game Servers**, server hold remotely

We choose Cloud Game server approaches since web game client as browsers, and connected to our Spring framework server.

There are two ways of connections between server and clients:

* **Non-Persistent Connections**, connection exists only if data need to be transfered, for example, send a email.
* **Persistent Connections**, server client will keep connected, unless it requires disconnect.

Obviously, web page use non-persistent connection, while `WebSocket` applications use **persistent connection** in a
game session. In multiplayer's game server, after user entering the game, we must continuously manage each player.

### 4.1 Create Game

Once client post create game, we'd create a unique GameID, add this game into database. If client join his created game,
then add this unique GameID to his session.

### 4.2 Join Game

### 4.3 In Game

A playerDataDTO must be provided to transfer player's data through json.

On Server Side:

1. After player is OnConnect, server should give player a player unique id to represent player in this game session,
   this unique id should be sent back to client for reference.
2. OnMessage to retrieves message through playerDataDTO
3. OnClose when client disconnects, cleanup and remove this player.

On Client Side:

1. Client request Websocket Connect to Server. Check connections and error response(not connected etc.).
2. provide onMessage method, get unique player ID dispatched by Server. Parse Server instruction
3. provide update methods, when any update happened on client side, send current state to Server.
4. provide OnClose method, when server side is disconnected

## 5. Game Client Design

### 5.1 Few problems on JS

#### 5.1.1 `__proto__` & `prototype` & `constructor`

For analysis each question, three point:

1. (`constructor`)function's constructor use which function
2. (`prototype`)function is inherited from which object
3. (`__proto__`)function has parent reference point to which object

Note 2. & 3. are describing same thing.

1. **The `function(object).prototype` is what we write as an Function(Object)'s defination.**
   Which put all method that is ready to be inherited by other class, whereby calling this function to instantiate.


2. The **constructor** is in `function(object).prototype` as
   `function(object).prototype.constructor()`
   provide the method to instantiate a `function(object)`.

3. The instantiation that inherited from `function.prototype`
   have referece `__proto__` point to `function.prototype`. Similar to Java Object, all objects has `__proto__`
   reference point to
   `Object.prototype`.
4. Similar to Java, `Object.prototype` contains many predefined method such as `toString()`.
5. Since `f Function()` is also considered to be constructed, and it's constructor is in `f Function.prototype`. That is
   to say, `f Function.prototype.constructor` is used as all function's constructor, that is construct by expression "
   var example = function(){}".

_**So when we say "use function as constructor", means use Function.prototype.constructor()!!!**_

For example, suppose define function `Parent()`, using constructor `Function.prototype.constructor()`, in another word,
function `Parent` inherited from object `Function.prototype`, and `Parent` has reference `Parent.__proto__`
point to object `Function.prototype`. Also, according to the previous analogy, all function's prototype is inherited
from `Object.prototype`, so does `Function.prototype`.

```js
var Parent = function () {
}
//Parent()'s constructor function is Function.prototype.constructor()
//Parent is inherited from Function.prototype
//Parent has reference Parent.__proto__ point to Function.prototype
//Function's constructor function is Function.prototype.constructor().
//Function is inherited from Function.prototype
//Function has reference Function.__proto__ point to Function.prototype
//Function.prototype's constructor function is itself
//Function.prototype is inherited from Object.prototype
//Function.prototype has reference Function.prototype.__proto__ point to Object.prototype
//Object's constructor function is f Function.prototype.constructor()
//Object is inherited from Function.prototype
//Object has reference Object.__proto__ point to Object.prototype
//Object.prototype's constructor is NULL
//Object.prototype is inherited from NULL
//Object.prototype has referemce Object.prototype.__proto__ point to NULL
//* Note also Parent() is only a function here.
```

suppose object `p1` construct using constructor `Parent()`, in another word, object`p1()` inherited from
object `Parent.prototype`.
`p1` has reference `p1.__proto__`to parent object `Parent.prototype`.

```js
var p1 = new Parent();
// p1's constructor is Parent.prototype.constructor()
// p1 is inherited from Parent.prototype
// p1 has reference p1.__proto__ to Parent.prototype
```

If one want to put value not in prototype but in it's own instantiation, a single assignment to an variable is
necessary:

```js
class A

()
{
    constructor()
    {
    }
    a = 1;
//constructor will construct a=1 in new instantiation
//but we cannot find a=1 in instantiation.__proto__
//(or A.prototype)
}

```

Note that the following map when say function(object) constructor, that means use it's function(object)
.prototype.constructor!
![](48568374-4a2ca8b9a839496e_fix732.webp)

#### 5.1.2 `this` in JS

To justify `this` referece.

In no-strict mode, undefined normally be `window`; In strict mode is undefined.

* Inside of function EventHandler, is the element.
* Outside of function, strict/no-strict, is global object. For example, window
* Inside of function, no-strict, is global object. For example, window.
* Inside of function, strict, is undefined. **Note Babel will translate component function to be strict mode**
* Inside of object, is object. Not include static methods.
* As object's method, is the object.(Normally object's method is set to be strict automatically, thus is undefined)
* As of function(object)'s constructor, is new object(instantiation). If have return, the new object value is defined by
  return
* As object's own method(not in prototype),
  **defined by "()=>"**, is outside scope(the object instantiation)
* Can be changed by bind()

An example about object's method

```js
class A {
    constructor(...) {...
    }

    render(...) {...
    }

    example(...) {
        console.log(this);
    }
}

//Call by instantiation
// `this` is point to the instantiation
const test1 = new A(...)
test1.example()

//Call directly
//object method is in heap
//(create another reference in stack to class method in heap)
//`this` is undefined
//because object's method will open strict mode automatically
const test2 = test1.example()
test2()//undefined
```

To solve this problem, we can bind the function's to it's instantiation, or use "()=>" to define the function as
following:

```js
class A {
    constructor(...) {
    ...
        this.example2 = this.example1().bind(this);
    }

    render(...) {...
    }

    example1(...) {
        console.log(this);
    }

    //this is not a function defination
    //but a assignment expression
    //this can not be tracked by instantiation.__proto__
    example3 = () => {
        console.log(this);
    };
}

//Call directly
//object method is in heap
//(create another reference in stack to class method in heap)
//`this` is class A
//Because this.example's this has been binded to
//the instantiation.
const test2 = new A().example2()
test2()//class A

//Note the bind method is still example1,
//since righto this.example2 is get from prototype,
//and bind() return a new function with new bind of this,
//so it's acutally get a "modified" example1, and 
//give it to prototype's example2.
//When new A() is called, 
// example2 is constructed out by constructor from prototype


//example is an instantiation method, defined by ()=>
//so "this" is pointed to outsider scope which is the 
//instantiation 
const test3 = new A().example3()
test3()//class A


```

**Note that object do not have it's constructor, the constructor is on `object.prototype`, while methods is defined
in `object.prototype` as well. Thus for expression "this.example2 = this.example1().bind(this);", the right side is
fetching this(`object.prototype`).example1 method from `object.prototype`, the left side is construct this(`object`) as
a new object with new method `example2()`**

#### 5.1.3 Closure

`var` used to create function scope variable inside a function, if one does not use `var` to create variable, actually
an Global scope variable is created.

Java's if else blocks does not create scope for `var`, thus if create statement with bracket blocks,
`var` inside actually create Global scope variable. On the other hand ES6 use `let` and `global` to create block scope
variable.

```js
functionO()
{
    var variable;
    return functionI()
    {
        return variable;
    }
}
functionI_instance = functionO();
```

The function will maintain reference to it's _lexical environment_, when functionI is inside functionO, it's lexical
environment is functionO's lexical environment, thus functionI will maintain reference to all **block scope** variable
that defined in functionO. Pratically, we will return functionI inside of functionO to access functionO even functionO
is died. In anther word, keep FunctionO's variable keep in memory.

Note that to delete closure function variable to prevent memory leaking.

### 5.2 React


#### 5.2.0 Spring Cross Origin

[React.js and Spring Data REST](https://spring.io/guides/tutorials/react-and-spring-data-rest/)
We want frontend and backend to be seperated, and communicate with JSON.

however, for example, the default react origin is "localhost:3000", but
the spring controller's origin is mount on "localhost:12345"(configured in myproporities)

We need package:
>org.apache.httpcomponents.httpclient 

And add allow cross origin annotation in front of controller

```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping(...)
        ...
```
#### 5.2.1 essential library

babel.min.js has two functionality:

* ES6 ==> ES5
* JSX ==> JS

react.development.js is React Core

react-dom.development.js is React extension for Dom

For react component, constructor is called once during initialization, instantiation is got by react, everytime when
state is changing, spring will call render once().

To avoid the changing of `this` in object method, one can defined the method by assignment `()=>`.

`react.development.js` and `babel.min.js` combined has several grammer sugar, for example, JS does not support the
Spread syntax(...)
to be used directly(Only in ReactDom.render to give component label), but react support in JS

```js
var p = new A();
console.log(...p)
//error, since ...p is illegal

var d = {...p, additional: "something"}
//correct, since grammer of deep copy an object
```

in JSX+react

```jsx
console.log(...p)
//correct, since react support the usage of ... directly
//BUT no output
//React only support label to use ... directly
```

Note that to comment on jsx return command of structure, we need to translate to js first by `()` then use JS normal way
to comment it

```jsx
render()
{
    return (
        (/*<input ref={(currNode)=>{this.refinput = currNode}}*/)
        //now it is commentted successfully
    )
```

#### 5.2.2 Three essential properties

For refs, It's not recommended to use too much. The input parameter is the current element node it self, there are three ways:
```jsx
////////////////////////
//For Arrow function way
class example extends React.Component {
    render() {
        return (
            <input ref={(currNode) => {
                this.refinput = currNode
            }}/>
            //here the currNode is <input...> it self    
            //we now add this ref to this class instantiation as refinput
            //And this ()=>{} function will be called twice when render() the page
            //because each time it's a new function
            //react will send null first to make sure it's clear
        )
    }
}

reactDOM.render(<example/>, document.getElementById('test'))
////////////////////
//Bound this function in class
class example extends React.Component {
    refFunction = (currNode) => {
        this.example = currNode;
    }

    render() {
        return (
            <input ref={this.refFunction}/>
        )
    }
}

reactDOM.render(<example/>, document.getElementById('test'))

//////////////////
//use createRef
class example extends React.Component {
    //create a container get all refs
    //but this container will be covered if the label name is the same
    //So we need to singly call createRef()
    refFunction = React.createRef()
    refFunction1 = React.createRef()
    render() {
        return (
            <input ref={this.refFunction}/>
            <input ref={this.refFunction1}/>
        )
    }
}

reactDOM.render(<example/>, document.getElementById('test'))
```

If the event is on the element that call ref itself, the ref is not necessary to define, since
render will return `event` to the same name function as input, and we can get the element by`event.target`

#### 5.2.3 Event

The Event process
...

Event is rewrite by React(for example, onclick is "onClick"" in react),
and give the event to the very outsider element.

#### 5.2.4 diff algorithm

Virtual DOM use label as a comparable minimum element. And compare label from outside to inside.



For react, where accept the data, where need to define data method.


For CORS problem, is able to send, but not possible to receive
The proxy is running on the proxy server is the same port as client,
but do not have ajax wall.


####Fetch and sync await
Separation of Concerns, Fetch and XHR(HMLHttpRequest):
XHR and it's related method(jQuary & Axios) is not suitable for SoC.
Fetch will seperate XHR connect and request data into few steps. May combine
await sync function to curry the responce info and try catch to solve throw error

```jsx
//async function
async ()=>{
    try(){
    const response = await fetch("/url")//step 1 connect Promise
        //response is the first step pending Promise
    const data = await response.json()//step 2 fetch data Promise
    console.log(data)
    }catch (e) {
        //solve error that throwed by above two steps
    }
}
```

####Router

SPA single page application through router. 
SPA urls(actually called path, because do not have actual html page url) 
now corresponding to multiple Component(or Functions).
* Backend Router, key is path, value is function, like spring controller
* Frontend Router(Hash Router with #), key is component. Corresponding to browser's history(BOM's history).



##6.Spring Authentication(JWT)
