const {mongoose} = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const mongoApiKey = "mongodb+srv://kaelovek:letmekeepitsecret@cluster0.y4hpw.mongodb.net/memesituations?retryWrites=true&w=majority";
const bcrypt = require("bcrypt");

mongoose.connect(mongoApiKey, {useUnifiedTopology: true, useNewUrlParser: true});

const {
	differentNums
} = require("../calculations/calculations")

const situations = new Schema({
	id: Number,
	situation: String,
});
const situations_model = model("situation", situations);

const User = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
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
				if (err){console.log(err)}else {
					//making array of situations from array off objects of situations
					for (let sit of results) {
						situations_to_get.push(sit.situation);
					}
					resolve(situations_to_get);
				}
			})
	})
}


const add_user = async (username,password) => {
	const hashPassword = String(bcrypt.hashSync(password, 10));
	let isUsernameAlreadyExist = await user_model.findOne({username: username});
	if (isUsernameAlreadyExist) {
		return "This username already taken"
	} else {
		let user = new user_model({
			username: username,
			password: hashPassword,
		});
		user.save(function (err) {
			if (err) return "err";
		})
		return "You were successfully registered"
	}
}

const check_user = async (username,password) => {

	let user = await user_model.findOne({username: username});
	if (!user) return "Username isn't valid";

	const validPassword = bcrypt.compareSync(password, user.password);
	if (!validPassword)return "Password isn't valid";
	return "token"

}


module.exports = {
	get_situations,
	add_user,
	check_user,
}