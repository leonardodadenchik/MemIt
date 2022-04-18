const {
  differentNums,
  generatorNotExist,
  cardGen,
  delete_player,
} = require("./moduleFunc");

cardGen(3, 5).forEach((el) => {
  console.log(el);
});
