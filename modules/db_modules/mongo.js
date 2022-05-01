const {mongoose} = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const mongoApiKey = "mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority";
const bcrypt = require("bcrypt");

mongoose.connect(mongoApiKey, {useUnifiedTopology: true, useNewUrlParser: true});

const {
	differentNums
} = require("../calculations/calculations")
const {promise} = require("bcrypt/promises");

const situations = new Schema({
	id: Number,
	situation: String,
});
const situations_model = model("situation", situations);

const User = new Schema({
	username: String,
	password: String,
	refresh_token_number: Number,
})

const user_model = model('User', User);


const get_situations = async (room_settings) => {
	let situations_to_get = [];
	return new Promise(async (resolve) => {
		situations_model
			.find({
				id: {
					$in: differentNums(await situations_model.countDocuments(), room_settings.sit_count),
				},
			}, (err, results) => {
				if (err) {
					resolve("err");
				} else {
					//making array of situations from array off objects of situations
					for (let sit of results) {
						situations_to_get.push(sit.situation);
					}
					resolve(situations_to_get);
				}
			})
	})
}


const add_user = async (username, password) => {
	return new Promise((resolve)=>{
		const hashPassword = String(bcrypt.hashSync(password, 10));
		user_model.findOne({username: username}).then(function (result) {
			if (result) {
				 resolve("This username already taken");
			} else {
				let user = new user_model({
					username: username,
					password: hashPassword,
				});
				user.save(function (err) {
					if (err) resolve("err");
				})
				resolve("You were successfully registered");
			}
		}).catch(function (err) {
			resolve("err");
		})
	})
}

const check_user = async (username, password) => {
	return new Promise((resolve) => {
		user_model.findOne({username: username}).then(function (result) {
			if (!result) resolve("Username isn't valid");
			const validPassword = bcrypt.compareSync(password, result.password);
			if (!validPassword) resolve("Password isn't valid");
			resolve("token");
		}).catch(function (err) {
			resolve("err");
		})
	});
}


module.exports = {
	get_situations,
	add_user,
	check_user,
}