const {mongoose} = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const mongoApiKey = "mongodb+srv://kaelovek:letmekeepitsecret@memit.shrjp0j.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoApiKey, {useUnifiedTopology: true, useNewUrlParser: true});

const situations = new Schema({
    id: Number,
    situation: String,
});

const situations_model = model("situation", situations);

const add_situation = async (situation,id) => {
    return new Promise((resolve) => {
        let newsituation = new situations_model({
            situation: situation,
            id: id,
        });
        newsituation.save(function (err) {
            if (err) resolve("err");
        })
        resolve();
        }).catch(function (err) {
            resolve("err");
        })
}



const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
let id = 14;
const read_situation = () => {
    const rl = readline.createInterface({ input, output });
    rl.question('Ситуация:',  (answer) => {
        add_situation(answer,id).then((response) => {
            console.log(response);
            id++;
            rl.close();
            read_situation();
        });
    });
}

read_situation();

