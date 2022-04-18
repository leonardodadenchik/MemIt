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
const { delete_player } = require('./module_func')

const photo_dir = './page/images_library'
const collection_situations = 'situations'
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
                        let situations = [];
                        await client.connect()
                        await client.db().collection(collection_situations).find({'id': {$in: different_nums(await client.db().collection(collection_situations).countDocuments(), jsonMessage.room_settings.sit_count, rand_int)}}).toArray(async (err, results) => {
                            //making array of situations from array off objects of situations
                            for (let sit of results) {
                                situations.push(sit.situation)
                            }
                        });
                        //create all data object \\ send it
                        let room_settings = {
                            code: await generatorNotExist(generatorCode,rooms),
                            playersCount: Number(jsonMessage.room_settings.player_count),
                            players: [],
                            situations: situations,
                            cards: card_gen(jsonMessage.room_settings.player_count, jsonMessage.room_settings.card_count, allPictureFiles, rand_int),
                            step:0,
                        };
                        rooms.push(room_settings);
                        wsClient.send(JSON.stringify({content: "code_for_creator", message: room_settings}));
                    }
                    create_room();
                    break;

                case 'connect_to_room':
                    async function roomVariants(){
                        let room = rooms.find(room => room.code === jsonMessage.code);
                        if (room) {
                            if (room.players.length === room.playersCount) {
                                wsClient.send(JSON.stringify({ content: "message", message: 'room already  fool lel -- =_=' }));
                            }else if(room.step != 0){
                                wsClient.send(JSON.stringify({content: "message",message:"game in this room has already begun"}));
                            } else {
                                wsClient.send(JSON.stringify({ content: "cards&room_code", cards: room.cards[room.players.length], room_code:jsonMessage.code}))
                                room.players.push(
                                    {
                                        name: jsonMessage.name,
                                        wsClient: wsClient,
                                        card: "selecting...",
                                    })
                                //adding player's name and wsClient to rooms
                                for (let i = 0; rooms.length - 1; i++){
                                    if (rooms[i].code === jsonMessage.code){
                                        rooms[i] = room;
                                        break;
                                    }
                                }
                                let players_names = [];
                                room.players.forEach(function (item){
                                    players_names.push(item.name);
                                })
                                room.players.forEach(function (item,i){
                                    item.wsClient.send(JSON.stringify({ content: "players_names", nicknames: players_names, player_id: i+1}));
                                })
                            }
                        } else{
                            wsClient.send(JSON.stringify({ content: "message", message: 'room not  exists 404 -- 0_0' }))
                        }
                    }
                    roomVariants()
                    break;

                case 'disconnect':
                    delete_player(jsonMessage.code,rooms,jsonMessage.player_id);
                    break;

                case 'kick_player':
                    delete_player(jsonMessage.code, rooms, jsonMessage.player_id);
                    break;

                case 'start_game':
                    for (let room of rooms) {
                        if ((room.code == jsonMessage.room_code)&(room.step == 0)) {
                            room.step = 1;
                            for (let player of room.players){
                                player.wsClient.send(JSON.stringify({content: "start_game"}));
                                player.wsClient.send(JSON.stringify({content: "situation",situation:room.situations[room.step-1]}));
                            }
                        }
                    }
                    break;

                case 'card':
                    for (let room of rooms) {
                        if (room.code == jsonMessage.room_code) {
                            room.players[jsonMessage.player_id-1].card = jsonMessage.card;
                            let players = [];
                            let cards = [];
                            for(let player of room.players){
                                players.push(player.name);
                                cards.push(player.card);
                            }
                            for(let player of room.players){
                                wsClient.send(JSON.stringify({ content: "card_status", players: players, cards: cards}));
                            }
                        }
                    }
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