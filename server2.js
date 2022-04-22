const express = require("express");
const app = express();
const WebSocket = require("ws");
const wsServer = new WebSocket.Server({port: 8814});

const {MongoClient} = require("mongodb");
const mongoApiKey = "mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority";
const client = new MongoClient(mongoApiKey);

const {
    differentNums,
    generatorNotExist,
    cardGen,
    delete_player,
    find_room_by_code,
    send_to_all,
    update_card_status,
    next_step,
    step_timer,
} = require("./module_func");

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
            if (jsonMessage.content === "room_creation") {
                async function create_room() {
                    // get random situations \\ send them
                    let situations = [];
                    await client.connect();
                    await client
                        .db()
                        .collection(collection_situations)
                        .find({
                            id: {
                                $in: differentNums(await client
                                    .db()
                                    .collection(collection_situations)
                                    .countDocuments(), jsonMessage.room_settings.sit_count),
                            },
                        })
                        .toArray(async (err, results) => {
                            //making array of situations from array off objects of situations
                            for (let sit of results) {
                                situations.push(sit.situation);
                            }
                        });
                    //create all data object \\ send it
                    let room_settings = {
                        code: await generatorNotExist(rooms),
                        playersCount: Number(jsonMessage.room_settings.player_count),
                        players: [],
                        situations: situations,
                        cards: cardGen(Number(jsonMessage.room_settings.player_count), Number(jsonMessage.room_settings.card_count)),
                        step: 0,
                        votes: 0,
                    };
                    rooms.push(room_settings);
                    wsClient.send(JSON.stringify({content: "code_for_creator", message: room_settings}));
                }

                create_room();

            } else if (jsonMessage.content === "connect_to_room") {
                async function roomVariants() {
                    let room = find_room_by_code(rooms, jsonMessage.room_code);
                    if (room) {
                        if (room.players.length === room.playersCount) {
                            wsClient.send(JSON.stringify({
                                content: "message", message: 'room already  fool lel -- =_='
                            }));
                        } else if (room.step != 0) {
                            wsClient.send(JSON.stringify({
                                content: "message", message: "game in this room has already begun"
                            }));
                        } else {
                            wsClient.send(JSON.stringify({
                                content: "cards&room_code",
                                cards: room.cards[room.players.length],
                                room_code: jsonMessage.room_code,
                            }))
                            room.players.push({
                                name: jsonMessage.name,
                                wsClient: wsClient,
                                card: "selecting...",
                                votes: 0,
                            })
                            //adding player's name and wsClient to rooms
                            for (let i = 0; rooms.length; i++) {
                                if (rooms[i].code === jsonMessage.room_code) {
                                    rooms[i] = room;
                                    break;
                                }
                            }
                            let players_names = [];
                            room.players.forEach(function (item) {
                                players_names.push(item.name);
                            })
                            room.players.forEach(function (item, i) {
                                item.wsClient.send(JSON.stringify({
                                    content: "players_names", nicknames: players_names, player_id: i + 1
                                }));
                            })
                        }
                    } else {
                        wsClient.send(JSON.stringify({
                            content: "message", message: "room not  exists 404 -- 0_0",
                        }));
                    }
                };
                roomVariants();

            } else if (jsonMessage.content === 'disconnect') {
                delete_player(jsonMessage.room_code, rooms, jsonMessage.player_id);

            } else if (jsonMessage.content === 'kick_player') {
                delete_player(jsonMessage.room_code, rooms, jsonMessage.player_id);

            } else if (jsonMessage.content === 'start_game') {
                let room = find_room_by_code(rooms, jsonMessage.room_code);
                room.step = 1;
                send_to_all(room, JSON.stringify({content: "start_game"}))
                send_to_all(room, JSON.stringify({
                    content: "situation", situation: room.situations[room.step - 1]
                }))
                update_card_status(room);
                step_timer(30,room);


            } else if (jsonMessage.content === 'card') {
                let room = find_room_by_code(rooms, jsonMessage.room_code);
                room.players[jsonMessage.player_id - 1].card = jsonMessage.card;
                update_card_status(room);
                if (!room.players.find(player => player.card == "selecting...") && (room.votes == room.players.length)) {
                    next_step(room);
                }

            } else if (jsonMessage.content === 'vote') {
                let room = find_room_by_code(rooms, jsonMessage.room_code);
                room.votes += 1;
                room.players[jsonMessage.vote - 1].votes += 1;
                if (!room.players.find(player => player.card == "selecting...") && (room.votes == room.players.length)) {
                    next_step(room);
                }

            } else {
                console.log('Unknown command');
            }
        } catch (error) {
            console.log('Error', error);
        }
    });

}
