---
title: JS Websocket over SpringBoot Framework
subtitle: Over websocket, socketJS, and STOMP
date: '2022-08-09'
label: js/spring
---

<p class="intro">
This session talked about how to use Websocket over SpringBoot app.
Springboot was extended from SpringMVC, which developed based on JavaEE's basic servlet.
Under this topic, we will discussed the JavaEE's servlet, Springboot's Message Broker and Endpoint,Session,
handshake and inteceptor.
</p>

## Websocket With Java Springboot {#Websocket_With_Java_Springboot}

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

## Message, Server, Servlet, Request, Response {#Message_Server_Servlet_Request_Response}

Historically, there're two parallel package to hold HTTP Request/Response:

* JavaEE Servlets(comes first)
* Apache Http Components Library

The JavaEE Servlets contains `HttpServletRequest` and `HttpServletResponse`, comparably Apache has `HttpRequest`
and `HttpResponse`.

### JavaEE Servlets {#JavaEEServlets}

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

### Apache Http Components Library {#ApacheHttpComponentsLibrary}

For the request header,`HttpRequest`need extra **METHOD**
thus `getHeader()` extends from `HttpMessage` as usual, while `getMethod()` defined by itself.

> `HttpRequest`<--(extends)--`HttpMessage`

A Server side representation is `ServerHttpRequest` and based on both JavaEE's `HttpInputMessage` and
Apache's `HttpRequest`.

A Whole combination of them is `ServletServerHttpRequest`, which is server-side, contains both
JavaEE's `ServletRequest` `HttpInputMessage` and Apache's `HttpRequest`.
![](/figure/Note_JS_WEBSOCKET_WITH_SPRING_img1.png)

## Springboot Basic Websocket Configuration {#SpringbootBasicWebsocketConfiguration}

### configureMessageBroker {#configureMessageBroker}

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

### registerStompEndpoints {#registerStompEndpoints}

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

## Springboot EventListener and HeadAccessor {#EventListenerandHeadAccessor}

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

## Springboot Scheduling {#Scheduling}

To regularly run we need to add annotation `@EnableScheduling`in front of Spring main function.

Note that If method was scheduled, it should not have any parameter.

## Springboot Interceptor {#Interceptor}

After adding interceptor on Websocket, the message now is passing through the way as:
> `message`--->`HandshakeInterceptor`--->`ChannelInterceptor`

### Channel Interceptor {#ChannelInterceptor}

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

### Session {#Session}

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

### Handshake Interceptor {#HandshakeInterceptor}

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
[Apache Http Components Library](#ApacheHttpComponentsLibrary), since only `ServletServerHttpRequest` has
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


