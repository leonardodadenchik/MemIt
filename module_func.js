exports.generatorCode = () => {
    return `f${(~~(Math.random() * 1e8)).toString(16)}`
}

exports.rand_int = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

exports.different_nums = (max, count, rand_int) => {
    var nums = [];
    var is_it;
    for (var i = 0; i < count; i++) {
        is_it = rand_int(1, max + 1);
        if (nums.includes(is_it)) {
            i -= 1;
        } else {
            nums.push(is_it)
        }
    }

    return nums
}


exports.generatorNotExist = async (generatorCode, client, collection_rooms) => {
    var attemp = generatorCode()
    //await client.connect();

    if (! !!await client.db().collection(collection_rooms).findOne({ code: attemp })) { //if attemp exist !!db.req == true \\   !! to bool
        return attemp
    } else {
        //console.log(`exist: ${attemp}`)
        return generatorNotExist(generatorCode, client, collection_rooms)
    }
}


exports.getAllDirPhotoFiles = (dirPath, fs) => {

    files = fs.readdirSync(dirPath)

    arrayOfFiles = []

    files.forEach(function (file) {

        if (['.png', '.jpg', 'jpeg'].includes(file.slice(-4))) {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}

exports.card_gen = (players_count, need_cards, img_files, rand_int) => {

    var cards = [];
    var player_cards = [];

    for (let i = 0; i < players_count; i++) {
        for (let j = 0; j < need_cards; j++) {
            var card_id = rand_int(0, img_files.length);

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

exports.getAllDirPhotoFiles = (dirPath, fs) => {

    files = fs.readdirSync(dirPath)

    arrayOfFiles = []

    files.forEach(function (file) {

        if (['.png', '.jpg', 'jpeg'].includes(file.slice(-4))) {
            arrayOfFiles.push(file)
        }
    })
    return arrayOfFiles
}

exports.card_gen = (players_count, need_cards, img_files, rand_int) => {

    var cards = [];
    var player_cards = [];

    for (let i = 0; i < players_count; i++) {
        for (let j = 0; j < need_cards; j++) {
            var card_id = rand_int(0, img_files.length);

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