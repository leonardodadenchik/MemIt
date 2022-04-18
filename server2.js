const express = require("express");
const app = express();
const WebSocket = require("ws");
const wsServer = new WebSocket.Server({ port: 8814 });

const { MongoClient } = require("mongodb");
const mongoApiKey =
  "mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority";
const client = new MongoClient(mongoApiKey);

const {
  differentNums,
  generatorNotExist,
  cardGen,
  delete_player,
} = require("./moduleFunc");

const PORT = process.env.PORT || 3000;
const collection_situations = "situations";

let rooms = [];

client.connect();

app.use(express.static(__dirname + "/page"));

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
      switch (jsonMessage.content) {
        case "room_creation":
          async function create_room() {
            // get random situations \\ send them
            let cards = [];
            await client.connect();
            await client
              .db()
              .collection(collection_situations)
              .find({
                id: {
                  $in: differentNums(
                    await client
                      .db()
                      .collection(collection_situations)
                      .countDocuments(),
                    jsonMessage.room_settings.sit_count
                  ),
                },
              })
              .toArray(async (err, results) => {
                //making array of situations from array off objects of situations
                for (let sit of results) {
                  cards.push(sit.situation);
                }
              });
            //create all data object \\ send it
            let room_settings = {
              code: await generatorNotExist(rooms),
              playersCount: Number(jsonMessage.room_settings.player_count),
              players: [],
              situations: cards,
              cards: cardGen(
                jsonMessage.room_settings.player_count,
                jsonMessage.room_settings.card_count
              ),
            };
            rooms.push(room_settings);
            wsClient.send(
              JSON.stringify({ content: "game_data", message: room_settings })
            );
          }
          create_room();
          break;

        case "connect_to_room":
          let roomVariants = async () => {
            let room = rooms.find((room) => room.code === jsonMessage.code);
            if (room) {
              if (room.players.length === room.playersCount) {
                wsClient.send(
                  JSON.stringify({
                    content: "message",
                    message: "room already  fool lel -- =_=",
                  })
                );
              } else {
                wsClient.send(
                  JSON.stringify({
                    content: "cards",
                    message: `cards: ${room.cards[room.players.length]}`,
                  })
                );
                room.players.push({
                  name: jsonMessage.name,
                  wsClient: wsClient,
                });
                //adding player's name and wsClient to rooms
                for (let i = 0; rooms.length; i++) {
                  if (rooms[i].code === jsonMessage.code) {
                    rooms[i] = room;
                    break;
                  }
                }
                let players_names = [];
                room.players.forEach(function (item) {
                  players_names.push(item.name);
                });
                room.players.forEach(function (item, i) {
                  item.wsClient.send(
                    JSON.stringify({
                      content: "players_names",
                      message: players_names,
                      player_id: i + 1,
                    })
                  );
                });
              }
            } else {
              wsClient.send(
                JSON.stringify({
                  content: "message",
                  message: "room not  exists 404 -- 0_0",
                })
              );
            }
          };
          roomVariants();
          break;

        case "disconnect":
          delete_player(jsonMessage.code, rooms, jsonMessage.player_id);
          break;
        case "kick_player":
          delete_player(jsonMessage.code, rooms, jsonMessage.player_id);
          break;
        default:
          console.log("Unknown command");
          break;
      }
    } catch (error) {
      console.log("Error", error);
    }
  });
}
