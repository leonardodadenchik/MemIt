const express = require("express");
const app = express();
const {Server} = require("ws");
const jsonParser = express.json();
const fallback = require('express-history-api-fallback')

const {
	delete_player,
	find_room_by_code,
	send_to_all,
	update_card_status,
	next_step,
	step_timer,
} = require("./modules/room_administration");
const {create_room} = require("./modules/room_creation");
const {connect_to_room} = require("./modules/room_connection");
const {
	sign_in,
	log_in,
	get_new_tokens,
	token_verification,
	verify_account,
} = require("./modules/authentication");
const root = __dirname + "/public";

const PORT = process.env.PORT || 3000;

let rooms = [];
app.use(express.static(root));
app.use(fallback('index.html', { root: root }));

app.post("/sign_in", jsonParser, sign_in);
app.post("/log_in", jsonParser, log_in);
app.post("/refresh_token", jsonParser, get_new_tokens);

const server = app.listen(PORT, () => console.log("Server is working!"));

const wsServer = new Server({ server: server });

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
	console.log("new connection");

	wsClient.on("close", function () {
		console.log("User disconnect");
	});

	wsClient.on("message", function (message) {
		try {
			const jsonMessage = JSON.parse(message);
			if (jsonMessage.content === "room_creation") {
				create_room(jsonMessage.room_settings, rooms).then((room) => {
					rooms.push(room);
					wsClient.send(
						JSON.stringify({content: "code_for_creator", code: room.code}),
					);
				});
			} else if (jsonMessage.content === "connect_to_room") {
				let room = find_room_by_code(rooms, jsonMessage.room_code);
				connect_to_room(wsClient, jsonMessage, room, rooms);
			} else if (jsonMessage.content === "delete_player") {
				if (jsonMessage.room_code) {
					delete_player(rooms, jsonMessage.player_id, jsonMessage.room_code,jsonMessage.isExit);
				}
			} else if (jsonMessage.content === "start_game") {
				let room = find_room_by_code(rooms, jsonMessage.room_code);
				room.step = 1;
				send_to_all(room, JSON.stringify({content: "start_game"}));
				update_card_status(room);
				step_timer(30, room);
			} else if (jsonMessage.content === "card") {
				let room = find_room_by_code(rooms, jsonMessage.room_code);
				room.players[jsonMessage.player_id - 1].card = jsonMessage.card;
				update_card_status(room);
				if (
					!room.players.find((player) => player.card === "selecting...") &&
					room.votes === room.players.length
				) {
					next_step(room);
				}
			} else if (jsonMessage.content === "vote") {
				let room = find_room_by_code(rooms, jsonMessage.room_code);
				room.votes += 1;
				room.players[jsonMessage.vote - 1].votes += 1;
				if (
					!room.players.find((player) => player.card === "selecting...") &&
					room.votes === room.players.length
				) {
					next_step(room);
				}
			} else if (jsonMessage.content === "verify_token") {
				if (token_verification(jsonMessage.token)) {
					wsClient.send(
						JSON.stringify({content: "message", message: "token_is_valid"}),
					);
				} else {
					wsClient.send(
						JSON.stringify({content: "message", message: "err"}),
					);
				}
			} else if (jsonMessage.content === "verify_account") {
				verify_account(jsonMessage.id).then((result) =>
					wsClient.send(JSON.stringify({content: "message", message: result}))
				)
			} else {
				console.log("Unknown command");
			}
		} catch (error) {
			console.log("Error", error);
		}
	});
}
