async function req_func(data_to_send) {
    let response = await fetch("/create_room", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(data_to_send)
    });
    let result = await response.json();
    if (result == "Success"){
        alert("room created");
    }else{
        alert("room is already exist");
    }
}

function send_room_data(){
    let room_name = document.getElementById("room_name").value;
    let data_to_send = {room_name: room_name};
    req_func(data_to_send);
};