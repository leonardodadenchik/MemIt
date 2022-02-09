//deafult variables
var p_count = 4;
var n_cards = 5;
//requaring
const fs = require('fs');
//typical randoming in js  from min to max(not include max)
const rand_int = (min, max)=> {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
//getting all filenemes from path, without dirFOLDER
const getAllDirFiles = (dirPath, arrayOfFiles)=> {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(file)
        }
    })

    arrayOfFiles.splice(0,1)
    //console.log(arrayOfFiles)
    return arrayOfFiles
}
// making card function
var Card_gen = (players_count,need_cards,img_files)=>{

    var cards = [];
        // arr with id's from arr with img names
        for (let i = 0; i < players_count*need_cards; i++){

            var card_id = rand_int(0,img_files.length);

            if (cards.includes(card_id)){
                i-=1;
            } else {
                cards.push(card_id)
                //console.log(img_files[card_id])
            }
        }

        //console.log(cards)


        //getting n arrs from 1 arr 
        for (let i = 0; i < players_count*need_cards; i += need_cards){
            let in_card_arr = [];
            for(j = 0; j < need_cards; j++){
               in_card_arr.push(img_files[cards[0]])
                cards.splice(0,1)
            }
            cards.push(in_card_arr)
        }



        return cards
};

console.log(Card_gen(p_count,n_cards,getAllDirFiles('./images_library')));