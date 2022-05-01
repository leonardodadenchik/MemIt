const express = require("express");
const app = express();
const WebSocket = require("ws");
const wsServer = new WebSocket.Server({ port: 8814 });
const jsonParser = express.json();

const {
  delete_player,
  find_room_by_code,
  send_to_all,
  update_card_status,
  next_step,
  step_timer,
} = require("./modules/room_administration");
const { create_room } = require("./modules/room_creation");
const { connect_to_room } = require("./modules/room_connection");
const { sign_in, log_in } = require("./modules/authentication");

const PORT = process.env.PORT || 3000;

let rooms = [];

app.use(express.static(__dirname + "/page"));

app.post("/registration", jsonParser, function (request, response) {
  sign_in(request.body).then((result) => response.json(result));
});
app.post("/log_in", jsonParser, function (request, response) {
  log_in(request.body).then((result) => response.json(result));
});

app.listen(PORT, () => console.log("Server is working!"));

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  console.log("new connection");

  wsClient.on("close", function () {
    console.log("User disconnect");
  });

  wsClient.on("message", function (message) {
    try {
      const jsonMessage = JSON.parse(message);
      if (jsonMessage.content === "room_creation") {
        create_room(jsonMessage.room_settings, rooms).then((room) => {
          rooms.push(room);
          console.log("roomCreated");
          wsClient.send(
            JSON.stringify({ content: "code_for_creator", message: room }),
            // here just code
          );
        });
      } else if (jsonMessage.content === "connect_to_room") {
        let room = find_room_by_code(rooms, jsonMessage.room_code);
        if (room) {
          connect_to_room(wsClient, jsonMessage, room, rooms);
          let players_names = [];
          room.players.forEach(function (item) {
            players_names.push(item.name);
          });
          room.players.forEach(function (item, i) {
            item.wsClient.send(
              JSON.stringify({
                content: "players_names",
                nicknames: players_names,
                player_id: i + 1,
              }),
            );
          });
        } else {
          wsClient.send(
            JSON.stringify({
              content: "message",
              message: "room not  exists 404 -- 0_0",
            }),
          );
        }
      } else if (jsonMessage.content === "delete_player") {
        if (jsonMessage.room_code) {
          let room = find_room_by_code(rooms, jsonMessage.room_code);
          if (room.players.length === 1) {
            rooms.splice(rooms.indexOf(room), 1);
          } else {
            delete_player(room, jsonMessage.player_id);
          }
        }
      } else if (jsonMessage.content === "start_game") {
        let room = find_room_by_code(rooms, jsonMessage.room_code);
        room.step = 1;
        send_to_all(room, JSON.stringify({ content: "start_game" }));
        send_to_all(
          room,
          JSON.stringify({
            content: "situation",
            situation: room.situations[room.step - 1],
          }),
        );
        update_card_status(room);
        step_timer(30, room);
      } else if (jsonMessage.content === "card") {
        let room = find_room_by_code(rooms, jsonMessage.room_code);
        room.players[jsonMessage.player_id - 1].card = jsonMessage.card;
        update_card_status(room);
        if (
          !room.players.find((player) => player.card == "selecting...") &&
          room.votes == room.players.length
        ) {
          next_step(room);
        }
      } else if (jsonMessage.content === "vote") {
        let room = find_room_by_code(rooms, jsonMessage.room_code);
        room.votes += 1;
        room.players[jsonMessage.vote - 1].votes += 1;
        if (
          !room.players.find((player) => player.card == "selecting...") &&
          room.votes == room.players.length
        ) {
          next_step(room);
        }
      } else {
        console.log("Unknown command");
      }
    } catch (error) {
      console.log("Error", error);
    }
  });
}
