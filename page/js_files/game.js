//global variables
let host = (location.origin.replace(/^http/, 'ws') + ":8814/").replace(":3000", '');
let myWs = new WebSocket(host);
let game_data = {
	room_code: "",
	nicknames: "",
	player_id: "",
	cards: "",
	is_card_sent: false,
	is_voted: false,
}
let timer;
let timeout_for_timer;

setInterval(function (){
	//get payload and check expire time
	let t_payload = JSON.parse(window.atob(localStorage.getItem("token").split(".")[1]));
	if(t_payload.exp-10<Math.floor(Date.now()/1000)){
		get_new_tokens();
	}
},3000)

async function get_new_tokens() {
	let data_to_send = JSON.stringify({token: localStorage.getItem("token"),refresh_token: localStorage.getItem("refresh_token")});
	let response = await fetch("/refresh_token", {
		method: 'POST',
		credentials: 'omit',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: data_to_send
	});
	let result = await response.json();
	if(result.token){
		localStorage.setItem("token",result.token);
		localStorage.setItem("refresh_token",result.refresh_token);

	}else{
		console.log(result);
	}
}
//registration("username","password");
async function registration(username, password) {
	let data_to_send = JSON.stringify({username: username, password: password})
	let response = await fetch("/registration", {
		method: 'POST',
		credentials: 'omit',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: data_to_send
	});
	let result = await response.json();
	if(result.token){
		localStorage.setItem("token",result.token);
		localStorage.setItem("refresh_token",result.refresh_token);

	}else{
		console.log(result)
	}
}

//log_in("username","password");
async function log_in(username, password) {
	let data_to_send = JSON.stringify({username: username, password: password})
	let response = await fetch("/log_in", {
		method: 'POST',
		credentials: 'omit',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: data_to_send
	});
	let result = await response.json();
	if(result.token){
		localStorage.setItem("token",result.token);
		localStorage.setItem("refresh_token",result.refresh_token);

	}else{
		console.log(result)
	}

}


//я блять ниже больше не полезу, сам это говно разгребай
window.onbeforeunload = function () {
	myWs.send(JSON.stringify({
		content: 'delete_player',
		player_id: game_data.player_id,
		room_code: game_data.room_code
	}));
}


function go_to_connection() {
	document.getElementById("visible_first").style.display = "none";
	document.getElementById("visible_second").style.display = "block";
}


function go_to_waiting_room() {
	document.getElementById("visible_second").style.display = "none";
	document.getElementById("visible_third").style.display = "block";
}


function go_to_game() {
	document.getElementById("visible_third").style.display = "none";
	document.getElementById("visible_fourth").style.display = "block";
}


function start_game() {
	if (game_data.player_id === 1) {
		myWs.send(JSON.stringify({content: 'start_game', room_code: game_data.room_code}));
	} else {
		alert("you haven't got permission");
	}
}


function send_room_data() {
	let room_settings = {
		player_count: document.getElementById("player_count").value,
		card_count: document.getElementById("card_count").value,
		sit_count: document.getElementById("sit_count").value,
	};
	go_to_connection();
	myWs.send(JSON.stringify({content: 'room_creation', room_settings: room_settings}))
}


function connect_to_room() {
	let room_code = document.getElementById("room_name").value;
	let player_name = document.getElementById("player_name").value;

	myWs.send(JSON.stringify({content: 'connect_to_room', room_code: room_code, name: player_name}));
}


function kick_player(player_to_kick) {
	if (game_data.player_id === 1) {
		myWs.send(JSON.stringify({
			content: 'delete_player',
			player_id: player_to_kick,
			room_code: game_data.room_code
		}));
	} else {
		alert("you haven't got permission");
	}
}


function send_card() {
	let card = document.getElementById("card_to_send").value;
	if ((game_data.cards.find((elem) => elem == card)) && (!game_data.is_card_sent)) {
		myWs.send(JSON.stringify({
			content: 'card',
			card: card,
			player_id: game_data.player_id,
			room_code: game_data.room_code
		}));
		game_data.is_card_sent = true;
		//deleting card from mas of player cards
		game_data.cards.splice(game_data.cards.indexOf(card), 1);
		let cards = document.getElementById("cards");
		cards.innerHTML = ""
		for (let element of game_data.cards) {
			cards.innerHTML += element + "<br>";
		}
		document.getElementById("card_status").innerHTML = "You have already made your move";
	} else if (game_data.is_card_sent) {
		alert("You have already made your move");
	} else {
		alert("You haven't got that card");
	}
}


function vote() {
	let vote = document.getElementById("vote").value;
	if ((vote >= 1) && (vote <= game_data.nicknames.length) && (!game_data.is_voted)) {
		alert(`you have voted for player ${vote}`)
		game_data.is_voted = true;
		myWs.send(JSON.stringify({content: "vote", vote: vote, room_code: game_data.room_code}));
		document.getElementById("vote_status").innerHTML = "You have already voted";
	} else if (game_data.is_voted) {
		alert("You have already voted")
	} else {
		alert("There aren't players with that id")
	}
}


function step_timer(seconds) {
	let show_timer = document.getElementById("timer");
	show_timer.innerHTML = seconds;
	timer = setInterval(() => {
		show_timer.innerHTML = Number(show_timer.innerHTML) - 1;
	}, 1000);
	timeout_for_timer = setTimeout(() => clearTimeout(timer), seconds * 1000)
}

function interrupt_timer() {
	clearInterval(timer);
	clearTimeout(timeout_for_timer);
}

myWs.onmessage = function (jsonMessage) {
	jsonMessage = JSON.parse(jsonMessage.data)
	if (jsonMessage.content === "message") {
		alert(jsonMessage.message);

	} else if (jsonMessage.content === "code_for_creator") {
		document.getElementById("room_name").value = jsonMessage.code;

	} else if (jsonMessage.content === "players_names") {
		game_data.nicknames = jsonMessage.nicknames;
		game_data.player_id = jsonMessage.player_id;
		document.getElementById("nicknames").innerHTML = game_data.nicknames;

	} else if (jsonMessage.content === "connectingAns") {
		if (jsonMessage.status === "connectedToRoom") {
			game_data.cards = jsonMessage.cards;
			game_data.room_code = jsonMessage.room_code;
			let cards = document.getElementById("cards");
			for (let element of game_data.cards) {
				cards.innerHTML += element + "<br>";
			}
			go_to_waiting_room();
		}else{
			alert(jsonMessage.status);
		}
	} else if (jsonMessage.content === "start_game") {
		go_to_game();
		step_timer(30);

	} else if (jsonMessage.content === "situation") {
		document.getElementById("situation").innerHTML = jsonMessage.situation;

	} else if (jsonMessage.content === "card_status") {
		let player_cards = document.getElementById("players_cards");
		player_cards.innerHTML = "";
		jsonMessage.players.forEach((item, i) => {
			player_cards.innerHTML += item + ": " + jsonMessage.cards[i] + "<br>";
		})

	} else if (jsonMessage.content === "next_step") {
		interrupt_timer();
		step_timer(30);
		alert("Next step, choose your card and vote for some player");
		document.getElementById("card_status").innerHTML = "You have not chosen a card yet";
		document.getElementById("vote_status").innerHTML = "You have not voted yet";
		game_data.is_voted = false;
		game_data.is_card_sent = false;
	} else if (jsonMessage.content === "end") {
		alert(`игра закончилась, победитель: ${jsonMessage.winner}`);
	}
};