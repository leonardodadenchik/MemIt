exports.generatorCode = () => {
    return `f${(~~(Math.random() * 1e8)).toString(16)}`
}


exports.rand_int = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


exports.different_nums = (max, count, rand_int) => {
    let nums = [];
    let is_it;
    for (let i = 0; i < count; i++) {
        is_it = rand_int(1, max + 1);
        if (nums.includes(is_it)) {
            i -= 1;
        } else {
            nums.push(is_it)
        }
    }

    return nums
}


exports.generatorNotExist = async (generatorCode, rooms) => {
    let attempt = generatorCode()
    //await client.connect();

    if (! rooms.find(room => room.code === attempt)) { //if attemp exist !!db.req == true \\   !! to bool
        return attempt
    } else {
        //console.log(`exist: ${attemp}`)
        return generatorNotExist(generatorCode, rooms)
    }
}


exports.getAllDirPhotoFiles = (dirPath, fs) => {

    let files = fs.readdirSync(dirPath)

    let arrayOfFiles = []
    files.forEach(function (file) {

        if (['.png', '.jpg', 'jpeg'].includes(file.slice(-4))) {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}


exports.card_gen = (players_count, need_cards, img_files, rand_int) => {

    let cards = [];
    let player_cards = [];

    for (let i = 0; i < players_count; i++) {
        for (let j = 0; j < need_cards; j++) {
            let card_id = rand_int(0, img_files.length);

            if (cards.includes(img_files[card_id])) {
                j -= 1;
            } else {
                cards.push(img_files[card_id])
            }

        }
        player_cards.push(cards.slice(i * need_cards, i * need_cards + need_cards));

    }

    return player_cards
}


exports.delete_player = (code,rooms,player_id) => {
    if (code) {
        for (let i = 0; rooms.length; i++) {
            if (rooms[i].code == code) {
                rooms[i].players.splice(player_id - 1, 1);
                let players_names = [];
                rooms[i].players.forEach(function (item, i, arr) {
                    players_names.push(item.name);
                })
                rooms[i].players.forEach(function (item, i, arr) {
                    item.wsClient.send(JSON.stringify({ content: "players_names", nicknames: players_names, player_id: i+1}));
                });
                break;
            }
        }
    }
}