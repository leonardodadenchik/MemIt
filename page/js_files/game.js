let myWs = new WebSocket("ws://memitgaym.herokuapp.com:1488/");

let game_data = {
    cards: "",
    room_code: "",
    nicknames: "",
}

async function req_func(data_to_send, link) {
    let response = await fetch(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data_to_send)
    });
    let result = await response.json();
    app.room_code = `your room code is: ${result.code}`;
    console.log(result);
}

function send_room_data() {
    let room_settings = {
        player_count: document.getElementById("player_count").value,
        card_count: document.getElementById("card_count").value,
        sit_count: document.getElementById("sit_count").value,
    };
    req_func(room_settings, "/get_values");
    app.go_to_connection();
}
window.onbeforeunload = wsClose;
function wsClose() {
    myWs.send(JSON.stringify({ action: 'disconnect', room_name: game_data.room_code }));
}
function connect_to_room() {
    let room_name = document.getElementById("room_name").value;
    game_data.room_code = room_name;
    let player_name = document.getElementById("player_name").value;

    myWs.send(JSON.stringify({ action: 'connect_to_room', code: room_name.toString(), name: player_name.toString() }));


    myWs.onmessage = function (message) {
        message = JSON.parse(message.data)
        switch (message.action) {
            case "message":
                break;
            default:
                console.log(message.message);
                break;

        }
    };
}