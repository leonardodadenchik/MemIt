const fs = require("fs");

const photoDir = "../page/images_library";

const { get_situations } = require("./db_modules/mongo");

const { differentNums } = require("./calculations/calculations");

const create_room = async (room_settings, rooms) => {
  let room = {
    code: await generatorNotExist(rooms),
    playersCount: Number(room_settings.player_count),
    players: [],
    situations: await get_situations(room_settings),
    cards: cardGen(
      Number(room_settings.player_count),
      Number(room_settings.card_count),
    ),
    step: 0,
    votes: 0,
  };
  return room;
};

const generatorCode = () => {
  return `f${(~~(Math.random() * 1e8)).toString(16)}`;
};

const getAllDirPhotoFiles = (dirPath) => {
  return fs.readdirSync(dirPath).filter((file) => {
    return [".png", ".jpg", "jpeg"].includes(file.slice(-4));
  });
};

const allPictureFiles = getAllDirPhotoFiles(photoDir);

const generatorNotExist = async (rooms) => {
  let attempt = generatorCode();

  return rooms.some((room) => room.code === attempt)
    ? generatorNotExist(rooms)
    : attempt;
};

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
    },
  );

  return playersCards;
};

module.exports = {
  create_room,
};
