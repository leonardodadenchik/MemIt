const express = require("express");
const app = express();
const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 8814 });

const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority')

const fs = require('fs');
const PORT = process.env.PORT || 3000

const jsonParser = express.json()
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

client.connect()

app.use(express.static(__dirname + "/page"));

app.listen(PORT, () => console.log("Сервер работает"));


wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log("new connection")

    wsClient.on('close', function () {
        console.log('Пользователь отключился');
    });


    wsClient.on('message', function (message) {
        try {
            const jsonMessage = JSON.parse(message);
            switch (jsonMessage.action) {
                case 'connect_to_room':
                    let roomVariants = async () => {
                        let room = await client.db().collection(collection_rooms).findOne({ code: jsonMessage.code })
                        if (!!room) {
                            let players = room.players
                            if (players.length === room.playersCount) {
                                wsClient.send(JSON.stringify({ action: "message", message: 'room already  fool lel -- =_=' }));
                            } else {
                                wsClient.send(JSON.stringify({ action: "message", message: `cards: ${room.cards[players.length]}` }))
                                players.push(
                                    {
                                        name: jsonMessage.name,
                                        wsClient: wsClient
                                    })
                                await client.db().collection(collection_rooms).updateOne(
                                    { code: room.code },
                                    {
                                        $set: {
                                            players: players
                                        }
                                    })
                                // Тут должен быть масив всех всклиентов и имён
                            }
                        } else {
                            wsClient.send(JSON.stringify({ action: "message", message: 'room not  exists 404 -- 0_0' }))
                        }
                    }
                    roomVariants()

                    // jsonMessage.code --> room id
                    // jsonMessage.name --> p name add
                    //wsClient --> add
                    break;


                case 'room_settings':
                    new Promise(async (resolve, reject) => {
                        // get random situations \\ send them
                        const answ = (data) => {
                            var dataToReturn = []
                            for (sit of data) {
                                dataToReturn.push(sit.situation)
                            }
                            return dataToReturn
                        }
                        await client.connect()
                        await client.db().collection(collection_situations).find({ 'id': { $in: different_nums(await client.db().collection(collection_situations).countDocuments(), jsonMessage.room_settings.sit_count, rand_int) } }).toArray(async (err, results) => {

                            resolve(answ(results))
                        });
                    }).then(async (data) => {
                        //create all data object \\ send it
                        return new Promise(async (resolve, reject) => {
                            resolve({
                                code: await generatorNotExist(generatorCode, client, collection_rooms),
                                playersCount: Number(jsonMessage.room_settings.player_count),
                                players: [],
                                situations: data,
                                cards: await card_gen(jsonMessage.room_settings.player_count, jsonMessage.room_settings.card_count, allPictureFiles, rand_int)
                            });
                        })
                    }).then((data) => {
                        client.db().collection(collection_rooms).insertOne(data);
                        wsClient.send(JSON.stringify({ action: "message", message: data }));

                    })
                    break;


                case 'disconnect':
                    console.log(jsonMessage.room_name);
                    break;
                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });

}