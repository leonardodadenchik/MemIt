host = (location.origin.replace(/^http/, 'ws')+":8814/").replace(":3000", '');
let myWs = new WebSocket(host);

let game_data = {
    room_code: "",
    nicknames: "",
    player_id: "",
    cards: "",

}


function send_room_data() {
    let room_settings = {
        player_count: document.getElementById("player_count").value,
        card_count: document.getElementById("card_count").value,
        sit_count: document.getElementById("sit_count").value,
    };
    app.go_to_connection();
    myWs.send(JSON.stringify({ content: 'room_creation', room_settings:room_settings}))
}


window.onbeforeunload = function () {
    myWs.send(JSON.stringify({ content: 'disconnect', player_id: game_data.player_id, code: game_data.room_code }));
}


function connect_to_room() {
    let room_name = document.getElementById("room_name").value;
    let player_name = document.getElementById("player_name").value;
    game_data.room_code = room_name;

    myWs.send(JSON.stringify({ content: 'connect_to_room', code: room_name, name: player_name}));

}


function start_game(){
    app.go_to_game();
}


//test: kick_player(1);
function kick_player(player_id){
    myWs.send(JSON.stringify({ content: 'kick_player', player_id: player_id, code: game_data.room_code }));
    game_data.room_code = "";
}


myWs.onmessage = function (message) {
    message = JSON.parse(message.data)
    switch (message.content) {
        case "message":
            alert(message.message);
            break;
        case "game_data":
            document.getElementById("room_name").value = message.message.code;
            break;
        case "players_names":
            game_data.nicknames = message.message;
            app.nicknames = message.message;
            game_data.player_id = message.player_id;
            break;
        case "cards":
            game_data.cards = message.message;
            //тут масив в message.message из кард и его по доброму бы засунуть в селект(не в жопу)
            document.getElementById("cards_list").value = message.message;
            app.go_to_waiting_room();
            break;
        default:
            console.log(Error);
            break;

    }
};
