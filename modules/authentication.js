const {add_user,check_user} = require("./db_modules/mongo")
const jwt = require('jsonwebtoken');

const sign_in = async (user_data) => {
	let expire_time = 48*60**2+Math.floor(Date.now() / 1000);
	let token = jwt.sign({user:user_data.username},"popka2489$@$#cO!~_",{expiresIn:"48h"});
	console.log(jwt.verify(token,"popka2489$@$#cO!~_"));
	return new Promise(async (resolve) =>
		resolve(await add_user(user_data.username, user_data.password))
	)
}

const log_in = async (user_data) => {
	return new Promise(async (resolve) => {
		resolve(await check_user(user_data.username,user_data.password));
	})
}
sign_in({username:"sdfsdf",password:"sdffsfdsfs"});
module.exports = {
	sign_in,
	log_in
}