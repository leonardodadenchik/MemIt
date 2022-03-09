const express = require("express");
const app = express();
const jsonParser = express.json()
let arr_of_rooms =[];

function is_room_already_exist(rooms,room) {
    for (let value of rooms){
        if (value.room_name == room){
            return false
        };
    };
    return true
}

app.use(express.static(__dirname + "/page"));

app.post("/user",jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.json(12);
});

app.post("/create_room",jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    if (is_room_already_exist(arr_of_rooms,request.body.room_name)){
        //adds value in arr of rooms
        arr_of_rooms.push({
            room_name:request.body.room_name,
            players:4,
        });
        response.json("Success");
    }else {
        response.json(false);
    }
    console.log(arr_of_rooms);

});

app.listen(3000, () => console.log("Сервер работает"));