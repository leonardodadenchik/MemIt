host = (location.origin.replace(/^http/, 'ws')+":8814/").replace(":3000", '');
let myWs = new WebSocket(host);

let game_data = {
    room_code: "",
    nicknames: "",
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
    myWs.send(JSON.stringify({ content: 'disconnect', room_name: game_data.room_code }));
}



function connect_to_room() {
    let room_name = document.getElementById("room_name").value;
    let player_name = document.getElementById("player_name").value;

    app.go_to_waiting_room();
    myWs.send(JSON.stringify({ content: 'connect_to_room', code: room_name.toString(), name: player_name.toString() }));

}

myWs.onmessage = function (message) {
    message = JSON.parse(message.data)
    switch (message.content) {
        case "message":
            console.log(message.message);
            break;
        case "game_data":
            game_data.room_code = message.message.code;
            app.room_code = game_data.room_code;
            break;
        case "players_names":
            game_data.nicknames = message.message;
            app.nicknames = message.message;
            break;
        default:
            console.log(Error);
            break;

    }
};
