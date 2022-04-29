const {add_user, check_user} = require("./db_modules/mongo")
const jwt = require('jsonwebtoken');
const jwt_parameters = require("./jwt_parametrs/jwt_parametrs");
const json = require("body-parser");


const new_tokens = function(username){
	let token = jwt.sign({user: username}, jwt_parameters.t_secret,{expiresIn:20});
	let refresh_token = jwt.sign({user: username}, jwt_parameters.r_t_secret,{expiresIn:60});
	return {
		token: token,
		refresh_token: refresh_token,
	};
}

const sign_in = async (request, response) => {
	request = request.body;
	add_user(request.username, request.password).then((result) => {
		if (result == "You were successfully registered") {
			response.json(new_tokens(request.username));
		} else {
			response.json(result);
		}
	});
}

const log_in = async (request, response) => {
	request = request.body;
	check_user(request.username, request.password).then(function(result) {
		if (result == "token") {
			response.json(new_tokens(request.username));
		} else {
			response.json(result);
		}
	});
}

const get_new_tokens = (request,response) => {
	request = request.body;
	jwt.verify(request.refresh_token,jwt_parameters.r_t_secret,(err, result)=>{
		if (err){
			response.json("refresh token expired, log_in please");
		}else{
			response.json(new_tokens("username"));
		}
	});
}

module.exports = {
	sign_in,
	log_in,
	get_new_tokens,
}