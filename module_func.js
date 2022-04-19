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

const delete_player = (code, rooms, player_id) => {
    if (code) {
        for (let i = 0; rooms.length; i++) {
            if (rooms[i].code == code) {
                rooms[i].players.splice(player_id - 1, 1);
                let players_names = [];
                rooms[i].players.forEach(function (item) {
                    players_names.push(item.name);
                });
                rooms[i].players.forEach(function (item, i) {
                    item.wsClient.send(
                        JSON.stringify({
                            content: "players_names",
                            message: players_names,
                            player_id: i + 1,
                        })
                    );
                });
                break;
            }
        }
    }
};

module.exports = {
    differentNums,
    generatorNotExist,
    cardGen,
    delete_player,
};