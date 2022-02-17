const express = require("express");
const app = express();
const jsonParser = express.json()

app.use(express.static(__dirname + "/page"));

app.post("/user",jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.json(12);
});

app.listen(3000, () => console.log("Сервер работает"));