const fs = require("fs");

const photoDir = "./page/images_library";

const generatorCode = () => {
    return `f${(~~(Math.random() * 1e8)).toString(16)}`;
};

const randInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

const differentNums = (maxValue, count) => {
    const getSet = (mySet) => {
        return mySet.size >= count
            ? mySet
            : getSet(mySet.add(randInt(0, maxValue)));
    };

    return Array.from(getSet(new Set()));
};

const generatorNotExist = async (rooms) => {
    let attempt = generatorCode();

    return rooms.some((room) => room.code === attempt)
        ? generatorNotExist(rooms)
        : attempt;
};

const getAllDirPhotoFiles = (dirPath) => {
    return fs.readdirSync(dirPath).filter((file) => {
        return [".png", ".jpg", "jpeg"].includes(file.slice(-4));
    });
};

const allPictureFiles = getAllDirPhotoFiles(photoDir);

const cardGen = (playersCount, needCards) => {
    let playersCards = Array(playersCount)
        .fill([])
        .map(() => []);

    let currentDeck = 0;
    differentNums(allPictureFiles.length, playersCount * needCards).forEach(
        (el) => {
            currentDeck =
                playersCards[currentDeck].length === needCards
                    ? ++currentDeck
                    : currentDeck;
            playersCards[currentDeck].push(allPictureFiles[el]);
        }
    );

    return playersCards;
};

const delete_player = (room_code, rooms, player_id) => {
    if (room_code) {
        let room = find_room_by_code(rooms, room_code)
        room.players.splice(player_id - 1, 1);
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
                })
            );
        });
    }
};

const find_room_by_code = (rooms, room_code) => {
    return (rooms.find(room => room.code === room_code))
}

const send_to_all = (room, message) => {
    room.players.forEach(function (item) {
        item.wsClient.send(message);
    })
}

const update_card_status = (room) => {
    let players = [];
    let cards = [];
    for (let player of room.players) {
        players.push(player.name);
        cards.push(player.card);
    }
    send_to_all(room,JSON.stringify({
        content: "card_status", players: players, cards: cards
    }))
}

const next_step = (room) => {
    if (room.step == room.cards[0].length){
        send_to_all(room, JSON.stringify({content: "end"}));
    }else {
        room.step += 1;
        room.votes = 0;
        room.players.map((item) => item.card = "selecting...");
        update_card_status(room);
        send_to_all(room, JSON.stringify({content: "next_step"}));
    }

}

module.exports = {
    differentNums,
    generatorNotExist,
    cardGen,
    delete_player,
    find_room_by_code,
    send_to_all,
    update_card_status,
    next_step,
};