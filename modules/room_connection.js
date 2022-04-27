function connect_to_room(wsClient, jsonMessage, room, rooms) {
	if (room.players.length === room.playersCount) {
		wsClient.send(JSON.stringify({
			content: "message", message: 'room already  fool lel -- =_='
		}));
	} else if (room.step != 0) {
		wsClient.send(JSON.stringify({
			content: "message", message: "game in this room has already begun"
		}));
	} else {
		wsClient.send(JSON.stringify({
			content: "cards&room_code",
			cards: room.cards[room.players.length],
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
};

module.exports = {
	connect_to_room
}