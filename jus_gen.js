const mysql = require('mysql');
const fs = require("fs");

const count_sit = 3;
const p_count = 4;
const n_cards = 4;

const photo_dir = './images_library'

const rand_int = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "situations",
    password: "letmekeepitsecret"
});

conn.connect(err => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database OK");
    }
});

const getAllDirPhotoFiles = (dirPath) => {

    files = fs.readdirSync(dirPath)

    arrayOfFiles =  []

    files.forEach(function (file) {

        if (['.png','.jpg','jpeg'].includes(file.slice(-4))) {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}

var Card_gen = (players_count, need_cards, img_files) => {

    var cards = [];
    player_cards = [];

    for (let i = 0; i < players_count ; i++) {
        for (let j =0; j< need_cards; j++){
            var card_id = rand_int(0, img_files.length);

            if (cards.includes(img_files[card_id]) ){
                j -= 1;
            } else {
                cards.push(img_files[card_id])
            }

        }
        player_cards.push(cards.slice(i*need_cards, i*need_cards + need_cards));

    }

    return player_cards
};

var sit_arr_gen = (getAllDirPhotoFiles, card_gen)=>{
    var a;

    p = new Promise((resolve,reject)=>{

        conn.query('SELECT COUNT(*) FROM Memesit',function(err, results, fields) {
            resolve(results)
        });
    })

    p.then(data =>{
        return new Promise((resolve, reject)=>{
            resolve(JSON.parse(JSON.stringify(data))[0]["COUNT(*)"])
        })
    }).then(count => {
        return new Promise((resolve, reject)=>{
            var numberry =[];
            var is_it;
            for (i=0; i<count_sit; i++){
                is_it = rand_int(1,count+1);
                if (numberry.includes(is_it)){
                    i-=1;
                } else {
                    numberry.push(is_it)
                }
            }

            resolve(numberry)
        })
    }).then((num_situations) => {

        return new Promise((resolve, reject)=>{

            conn.query(`SELECT Theme FROM Memesit WHERE Id IN (${num_situations.toString()})`,function(err, results, fields) {
                resolve(results)
            });
        })
    }).then(situations => {
        return new Promise((resolve, reject)=>{
            var last_edit = [];
            for (var s of JSON.parse(JSON.stringify(situations))){
                last_edit.push(s.Theme)
            }

            var data_obj = {
                themes: last_edit,
                cards: card_gen(p_count,n_cards,getAllDirPhotoFiles(photo_dir))
            }
            resolve(data_obj)
        })
    }).then(final =>{
        a = final
    })
    setTimeout(()=> {console.log(a)},1000)

}

sit_arr_gen(getAllDirPhotoFiles,Card_gen);