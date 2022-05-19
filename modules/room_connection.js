function connect_to_room(wsClient, jsonMessage, room, rooms) {
	if (room) {
		if (room.step != 0) {
			wsClient.send(JSON.stringify({
				content: "connectingAns", status: "Гра вже почалася"
			}));
		} else if (room.players.length === room.playersCount) {
			wsClient.send(JSON.stringify({
				content: "connectingAns", status: 'Кімната переповнена'
			}));
		} else {
			wsClient.send(JSON.stringify({
				content: "connectingAns",
				status: "connectedToRoom",
				cards: room.cards[room.players.length],
				situations: room.situations,
				room_code: jsonMessage.room_code,
			}))
			room.players.push({
				name: jsonMessage.name,
				wsClient: wsClient,
				card: "selecting...",
				votes: 0,
			})
			//adding player's name and wsClient to rooms
			rooms[rooms.indexOf(room)] = room;
		}
		let players_names = [];
		room.players.forEach(function (item) {
			players_names.push(item.name);
		})
		room.players.forEach(function (item, i) {
			item.wsClient.send(JSON.stringify({
				content: "players_names", nicknames: players_names, player_id: i + 1
			}));
		})
	} else {
		wsClient.send(JSON.stringify({
			content: "connectingAns", status: "Кімната не існує",
		}));
	}
};

module.exports = {
	connect_to_room
}