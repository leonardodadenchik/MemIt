const fs = require("fs");

let timer;

const delete_player = (rooms, player_id, room_code, is_exit) => {
	let room = find_room_by_code(rooms, room_code);
	if (room) {
		if (!is_exit) {
			room.players[player_id - 1].wsClient.send(
				JSON.stringify({content: "kick"}),
			);
		}

		if (room.players.length === 1) {
			rooms.splice(rooms.indexOf(room), 1);
		} else {
			room.players.splice(player_id - 1, 1);
			let players_names = [];
			room.players.forEach(function (item) {
				players_names.push(item.name);
			});
			room.players.forEach(function (item, i) {
				item.wsClient.send(
					JSON.stringify({
						content: "players_names",
						nicknames: players_names,
						player_id: i + 1,
					}),
				);
			});
		}
	}
};

const find_room_by_code = (rooms, room_code) => {
	return rooms.find((room) => room.code === room_code);
};

const send_to_all = (room, message) => {
	room.players.forEach(function (item) {
		item.wsClient.send(message);
	});
};

const update_card_status = (room) => {
	let players = [];
	let cards = [];
	for (let player of room.players) {
		players.push(player.name);
		cards.push(player.card);
	}
	send_to_all(
		room,
		JSON.stringify({
			content: "card_status",
			players: players,
			cards: cards,
		}),
	);
};

const next_step = (room) => {
	if (room.step == room.situations.length) {
		room.players.sort((a, b) => b.votes - a.votes);
		send_to_all(
			room,
			JSON.stringify({content: "end", winner: room.players[0].name}),
		);
	} else {
		room.step += 1;
		room.votes = 0;
		room.players.map((item) => (item.card = "selecting..."));
		update_card_status(room);
		send_to_all(room, JSON.stringify({content: "next_step"}));
		clearTimeout(timer);
		step_timer(30, room);
	}
};

const step_timer = (seconds, room) => {
	timer = setTimeout(next_step, seconds * 1000, room);
};

module.exports = {
	delete_player,
	find_room_by_code,
	send_to_all,
	update_card_status,
	next_step,
	step_timer,
};
