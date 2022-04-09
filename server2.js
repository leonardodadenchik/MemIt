const express = require("express");
const app = express();
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 8814 });

const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority')

const fs = require('fs');
const PORT = process.env.PORT || 3000

const { generatorCode } = require('./module_func')
const { different_nums } = require('./module_func')
const { rand_int } = require('./module_func')
const { generatorNotExist } = require('./module_func')
const { getAllDirPhotoFiles } = require('./module_func')
const { card_gen } = require('./module_func')

const photo_dir = './page/images_library'
const collection_situations = 'situations'
const collection_rooms = 'rooms'
const allPictureFiles = getAllDirPhotoFiles(photo_dir, fs)

let rooms = []

client.connect()

app.use(express.static(__dirname + "/page"));

app.listen(PORT, () => console.log("Server is working!"));


wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log("new connection")

    wsClient.on('close', function () {
        console.log('User disconnect');
    });


    wsClient.on('message', function (message) {
        try {
            const jsonMessage = JSON.parse(message);
            switch (jsonMessage.content) {
                case 'room_creation':
                    async function create_room() {
                        // get random situations \\ send them
                        let cards = [];
                        await client.connect()
                        await client.db().collection(collection_situations).find({'id': {$in: different_nums(await client.db().collection(collection_situations).countDocuments(), jsonMessage.room_settings.sit_count, rand_int)}}).toArray(async (err, results) => {
                            //making array of situations from array off objects of situations
                            for (let sit of results) {
                                cards.push(sit.situation)
                            }
                        });
                        //create all data object \\ send it
                        let room_settings = {
                            code: await generatorNotExist(generatorCode, client, collection_rooms),
                            playersCount: Number(jsonMessage.room_settings.player_count),
                            players: [],
                            situations: cards,
                            cards: await card_gen(jsonMessage.room_settings.player_count, jsonMessage.room_settings.card_count, allPictureFiles, rand_int)
                        };
                        rooms.push(room_settings);
                        wsClient.send(JSON.stringify({content: "game_data", message: room_settings}));
                    }
                    create_room();
                    break;


                case 'connect_to_room':
                    let roomVariants = async () => {
                        let room = rooms.find(room => room.code == jsonMessage.code);
                        if (room) {
                            if (room.players.length === room.playersCount) {
                                wsClient.send(JSON.stringify({ content: "message", message: 'room already  fool lel -- =_=' }));
                            } else {
                                wsClient.send(JSON.stringify({ content: "message", message: `cards: ${room.cards[room.players.length]}` }))
                                room.players.push(
                                    {
                                        name: jsonMessage.name,
                                        wsClient: wsClient
                                    })
                                //adding player's name and wsClient to rooms
                                for (let i = 0; rooms.length; i++){
                                    if (rooms[i].code == jsonMessage.code){
                                        rooms[i] = room;
                                        break;
                                    }
                                }
                                let players_names = [];
                                room.players.forEach(function (item, i, arr){
                                    players_names.push(item.name);
                                })
                                room.players.forEach(function (item, i, arr){
                                    item.wsClient.send(JSON.stringify({ content: "players_names", message: players_names }));
                                })

                            }
                        } else {
                            wsClient.send(JSON.stringify({ content: "message", message: 'room not  exists 404 -- 0_0' }))
                        }
                    }
                    roomVariants()
                    break;


                case 'disconnect':
                    console.log(jsonMessage.room_name);
                    break;
                default:
                    console.log('Unknown command');
                    break;
            }
        } catch (error) {
            console.log('Error', error);
        }
    });

}