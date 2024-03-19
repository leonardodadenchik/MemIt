const {mongoose} = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const mongoApiKey = "mongodb+srv://kaelovek:letmekeepitsecret@memit.shrjp0j.mongodb.net/?retryWrites=true&w=majority";
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
    username: String,
    password: String,
    email: String,
    isActive: Boolean,
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


const add_user = async (username, email, password) => {
    return new Promise((resolve) => {
        let hashPassword = String(bcrypt.hashSync(password, 10));
        user_model.findOne({email: email}).then(function (result) {
            if (result) {
                resolve("This email already taken");
            } else {
                let user = new user_model({
                    username: username,
                    email: email,
                    password: hashPassword,
                });
                user.save(function (err) {
                    if (err) resolve("err");
                })
                resolve({player_id:user.id});
            }
        }).catch(function (err) {
            resolve("err");
        })
    })
}

const check_user = async (email, password) => {
    return new Promise((resolve) => {
        user_model.findOne({email: email}).then(function (result) {
            if (!result) resolve("Email isn't valid");
            if (!result.isActive) resolve("Account is not active");
            let validPassword = bcrypt.compareSync(password, result.password);
            if (!validPassword) resolve("Password isn't valid");
            resolve("token");
        }).catch(function (err) {
            resolve("err");
        })
    });
}

const activate_account = async (id) => {
    return new Promise((resolve)=>{
        user_model.findById(id).then(function (result) {
            if (!result) resolve("err");
            if (result.isActive) resolve("account already activated");
            user_model.findByIdAndUpdate(id,{isActive:true}).catch(function (err) {resolve("err")});
            resolve("account successfully activated")
        }).catch(function (err) {
            resolve("err")
        })
    });
}


module.exports = {
    get_situations,
    add_user,
    check_user,
    activate_account,
}
