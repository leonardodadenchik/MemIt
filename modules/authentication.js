const {add_user, check_user} = require("./db_modules/mongo")
const jwt = require('jsonwebtoken');
const jwt_parameters = require("./jwt_parametrs/jwt_parametrs");
const json = require("body-parser")
const nodemailer = require('nodemailer');

const validation_mail = async function (username,email,player_id) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: "idea.memit@gmail.com",
			pass: "Dolgih_is_legend",
		},
	})

	let result = await transporter.sendMail({
		from: '"MemIt" <idea.memit@gmail.com>',
		to: email,
		subject: 'Doing your mom',
		text: `Your activation code is ${player_id}`,
	})

	console.log(result)
}

const new_tokens = function (email) {
	let token = jwt.sign({email: email}, jwt_parameters.t_secret, {expiresIn: 20});
	let refresh_token = jwt.sign({email: email}, jwt_parameters.r_t_secret, {expiresIn: 60});
	return {
		token: token,
		refresh_token: refresh_token,
	};
}

const sign_in = async (request, response) => {
	request = request.body;
	add_user(request.username,request.email, request.password).then((result) => {
		if (result.player_id) {

			validation_mail(request.username,request.email,result.player_id);
		} else {
			response.json(result);
		}
	});
}

const log_in = async (request, response) => {
	request = request.body;
	check_user(request.email, request.password).then(function (result) {
		if (result === "token") {
			response.json(new_tokens(request.email));
		} else {
			response.json(result);
		}
	});
}

const get_new_tokens = (request, response) => {
	request = request.body;
	jwt.verify(request.refresh_token, jwt_parameters.r_t_secret, (err, result) => {
		if (err) {
			response.json("refresh token expired, log_in please");
		} else {
			response.json(new_tokens(result.email));
		}
	});
}

const token_verification = (token) => {
	return new Promise((resolve) => {
		jwt.verify(token, jwt_parameters.t_secret, (err, result) => {
			if (result) {
				resolve(true);
			} else {
				resolve(false);
			}

		});
	});
}

module.exports = {
	sign_in,
	log_in,
	get_new_tokens,
	token_verification
}