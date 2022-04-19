host = (location.origin.replace(/^http/, 'ws') + ":8814/").replace(":3000", '');
let myWs = new WebSocket(host);

let game_data = {
    room_code: "",
    nicknames: "",
    player_id: "",
    cards: "",
}

window.onbeforeunload = function () {
    myWs.send(JSON.stringify({content: 'disconnect', player_id: game_data.player_id, code: game_data.room_code}));
}


function go_to_connection() {
    document.getElementById("visible_first").style.display = "none";
    document.getElementById("visible_second").style.display = "block";
}


function go_to_waiting_room() {
    document.getElementById("visible_second").style.display = "none";
    document.getElementById("visible_third").style.display = "block";
}


function go_to_game() {
    document.getElementById("visible_third").style.display = "none";
    document.getElementById("visible_fourth").style.display = "block";
}


function start_game() {
    if (game_data.player_id === 1) {
        myWs.send(JSON.stringify({content: 'start_game', room_code: game_data.room_code}));
    } else {
        alert("you haven't got permission");
    }
}


function send_room_data() {
    let room_settings = {
        player_count: document.getElementById("player_count").value,
        card_count: document.getElementById("card_count").value,
        sit_count: document.getElementById("sit_count").value,
    };
    go_to_connection();
    myWs.send(JSON.stringify({content: 'room_creation', room_settings: room_settings}))
}


function connect_to_room() {
    let room_name = document.getElementById("room_name").value;
    let player_name = document.getElementById("player_name").value;

    myWs.send(JSON.stringify({content: 'connect_to_room', code: room_name, name: player_name}));
}

function send_card() {
    let card = document.getElementById("card_to_send").value;
    if (game_data.cards.find((elem) => elem == card)) {
        myWs.send(JSON.stringify({
            content: 'card',
            card: card,
            player_id: game_data.player_id,
            room_code: game_data.room_code
        }));
    } else {
        alert("you haven't got that card");
    }
}


function kick_player(player_id) {
    if (game_data.player_id === 1) {
        myWs.send(JSON.stringify({content: 'kick_player', player_id: player_id, code: game_data.room_code}));
    } else {
        alert("you haven't got permission");
    }
}


myWs.onmessage = function (jsonMessage) {
    jsonMessage = JSON.parse(jsonMessage.data)
    switch (jsonMessage.content) {
        case "message":
            alert(jsonMessage.message);
            break;

        case "code_for_creator":
            document.getElementById("room_name").value = jsonMessage.message.code;
            break;

        case "players_names":
            game_data.nicknames = jsonMessage.nicknames;
            game_data.player_id = jsonMessage.player_id;
            document.getElementById("nicknames").innerHTML = game_data.nicknames;
            break;

        case "cards&room_code":
            game_data.cards = jsonMessage.cards;
            game_data.room_code = jsonMessage.room_code;
            cards = document.getElementById("cards");
            for (let element of jsonMessage.cards) {
                cards.innerHTML += element + "<br>";
            }
            go_to_waiting_room();
            break;

        case "start_game":
            go_to_game();
            break;

        case "situation":
            document.getElementById("situation").innerHTML = jsonMessage.situation;
            break;

        case "card_status":
            let player_cards = document.getElementById("players_cards");
            player_cards.innerHTML = "";
            console.log(jsonMessage.players);
            jsonMessage.players.forEach((item, i) => {
                player_cards.innerHTML += item + ": " + jsonMessage.cards[i] + "<br>";
            })
            break;
        default:
            break;
    }
};
