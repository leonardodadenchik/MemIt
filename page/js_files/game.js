async function req_func(data_to_send) {
    let response = await fetch("/get_values", {
        method: 'POST',
        headers: {
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(data_to_send)
    });
    let result = await response.json();

    console.log(result);
    /*
    let innering = '';
    for(elem of result){

        innering = innering + elem.situation + '\n'
    }
    document.getElementById('wait').innerText = innering
    */
}


function send_room_data(){
     // document.getElementById("sit_id_s").value;
    let room_settings = {
        player_count: document.getElementById("player_count").value,
        card_count: document.getElementById("card_count").value,
        sit_count: document.getElementById("sit_count").value,
        nicknames: document.getElementById("nicknames").value,
    };
    req_func(room_settings);
}