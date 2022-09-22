---
title: React and Websocket Game Design
subtitle: Notes about Summer 2022 project with Drew Hilton
date: '2022-08-15'
label: js
---


## Communication Mode {#CommunicationMode}

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

### Broadcast Way {#BroadcastWay}

- Unicast: point to point
- Broadcast: everyone
- Multicast: point to Groups


## Game Server Design {#GameServerDesign}

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

### Create Game {#CreateGame}

Once client post create game, we'd create a unique GameID, add this game into database. If client join his created game,
then add this unique GameID to his session.

### Join Game {#JoinGame}

### In Game {#InGame}

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

## Game Client Design {#GameClientDesign}

