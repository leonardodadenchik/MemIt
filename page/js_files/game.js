host = (location.origin.replace(/^http/, 'ws') + ":8814/").replace(":3000", '');
let myWs = new WebSocket(host);

let game_data = {
    room_code: "",
    nicknames: "",
    player_id: "",
    cards: "",
    is_card_sent: false,
    is_voted: false,
}

window.onbeforeunload = function () {
    myWs.send(JSON.stringify({content: 'disconnect', player_id: game_data.player_id, room_code: game_data.room_code}));
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
    let room_code = document.getElementById("room_name").value;
    let player_name = document.getElementById("player_name").value;

    myWs.send(JSON.stringify({content: 'connect_to_room', room_code: room_code, name: player_name}));
}


function kick_player(player_id) {
    if (game_data.player_id === 1) {
        myWs.send(JSON.stringify({content: 'kick_player', player_id: player_id, room_code: game_data.room_code}));
    } else {
        alert("you haven't got permission");
    }
}


function send_card() {
    let card = document.getElementById("card_to_send").value;
    if ((game_data.cards.find((elem) => elem == card))&&(!game_data.is_card_sent)) {
        myWs.send(JSON.stringify({
            content: 'card',
            card: card,
            player_id: game_data.player_id,
            room_code: game_data.room_code
        }));
        game_data.is_card_sent = true;
        //deliting card from mas of player cards
        game_data.cards.splice(game_data.cards.indexOf(card), 1);
        cards = document.getElementById("cards");
        cards.innerHTML = ""
        for (let element of game_data.cards) {
            cards.innerHTML += element + "<br>";
        }
        document.getElementById("card_status").innerHTML = "You have already made your move";
    } else if(game_data.is_card_sent) {
        alert("You have already made your move");
    }else{
        alert("You haven't got that card");
    }
}


function vote() {
    let vote = document.getElementById("vote").value;
    if ((vote>=1)&&(vote<=game_data.nicknames.length)&&(!game_data.is_voted)) {
        alert(`you have voted for player ${vote}`)
        game_data.is_voted = true;
        myWs.send(JSON.stringify({content: "vote",vote: vote, room_code: game_data.room_code}));
        document.getElementById("vote_status").innerHTML = "You have already voted";
    }else if(game_data.is_voted){
        alert("You have already voted")
    }else{
        alert("There aren't players with that id")
    }
}


myWs.onmessage = function (jsonMessage) {
    jsonMessage = JSON.parse(jsonMessage.data)
    if (jsonMessage.content === "message") {
        alert(jsonMessage.message);

    } else if (jsonMessage.content === "code_for_creator") {
        document.getElementById("room_name").value = jsonMessage.message.code;

    } else if (jsonMessage.content === "players_names") {
        game_data.nicknames = jsonMessage.nicknames;
        game_data.player_id = jsonMessage.player_id;
        document.getElementById("nicknames").innerHTML = game_data.nicknames;

    } else if (jsonMessage.content === "cards&room_code") {
        game_data.cards = jsonMessage.cards;
        game_data.room_code = jsonMessage.room_code;
        cards = document.getElementById("cards");
        for (let element of game_data.cards) {
            cards.innerHTML += element + "<br>";
        }
        go_to_waiting_room();

    } else if (jsonMessage.content === "start_game") {
        go_to_game();

    } else if (jsonMessage.content === "situation") {
        document.getElementById("situation").innerHTML = jsonMessage.situation;

    } else if (jsonMessage.content === "card_status") {
        let player_cards = document.getElementById("players_cards");
        player_cards.innerHTML = "";
        jsonMessage.players.forEach((item, i) => {
            player_cards.innerHTML += item + ": " + jsonMessage.cards[i] + "<br>";
        })

    } else if(jsonMessage.content === "next_step"){
        alert("Next step, choose your card and vote for some player");
        document.getElementById("card_status").innerHTML = "You have not chosen a card yet";
        document.getElementById("vote_status").innerHTML = "You have not voted yet";
        game_data.is_voted = false;
        game_data.is_card_sent = false;
    } else if(jsonMessage.content === "end"){
        alert(`игра закончилась, победитель: ${jsonMessage.winner}`);
    }
};
