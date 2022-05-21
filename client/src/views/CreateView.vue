<template>
    <button @click="redirMethod('play')" class="backButton">&#8666;</button>
    <div class="create">
        <h1>Cтворити кімнату</h1>
        <h3>Кількість карток: {{ cardCount }}</h3>
        <br />
        <input
            class="inputSlider"
            type="range"
            id="volume"
            min="4"
            max="7"
            v-model="cardCount"
        /><br /><br />
        <h3>Кількість ситуацій: {{ situationCount }}</h3>
        <br />
        <input
            class="inputSlider"
            type="range"
            id="volume"
            min="1"
            max="4"
            v-model="situationCount"
        /><br /><br />

        <button class="connectButton" @click="roomCreatereques">
            Створити
        </button>
    </div>
</template>

<script>
import myWs from '../assets/myWs/myWs.js'
export default {
    data() {
        return {
            cardCount: 4,
            situationCount: 3,
        }
    },
    methods: {
        redirMethod(where) {
            this.$router.push({
                name: where,
            })
        },
        roomCreatereques() {
            new Promise((resolve, reject) => {
                myWs.send(
                    JSON.stringify({
                        content: 'room_creation',
                        room_settings: {
                            player_count: '5',
                            card_count: this.cardCount,
                            sit_count: this.situationCount,
                        },
                    })
                )
                myWs.onmessage = (jsonMessage) => {
                    jsonMessage = JSON.parse(jsonMessage.data)
                    if (jsonMessage.content == 'code_for_creator') {
                        if (jsonMessage.code) {
                            resolve(jsonMessage.code)
                        } else {
                            reject()
                        }
                    }
                }
            })
                .then((code) => {
                    this.$router.push({
                        name: 'connect',
                        params: { code: code },
                    })
                })
                .catch(() => {
                    this.$router.push({
                        path: '/error',
                    })
                })
        },
    },
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
.create {
    position: absolute;
    position: absolute;
    background-color: #a5d3d4;
    height: 70vh;
    width: 30vw;
    left: 35vw;
    top: 15vh;
    border-radius: 1.5em/1.5em;
    font-family: 'Nunito', sans-serif;
}
.create h1 {
    color: #4c584d;
    font-size: 5vh;
    padding-top: 6vh;
    text-align: center;
}
.create h3 {
    color: #584c4e;
    font-size: 3vh;
    text-align: center;
}

.inputSlider {
    margin: 0;
    margin-left: 6vw;
    height: 0.3vh;
    width: 18vw;
    background: transparent;
    border: none;
}
.inputSlider:focus {
    outline: none;
}
inputSlider:hover {
    outline: none;
}
.backButton {
    position: fixed;
    top: 0%;
    left: 0%;
    border-radius: 50%;
    border: none;
    background-color: rgb(197, 244, 174);
    color: #4c584d;
    width: 50px;
    height: 50px;
}
.connectButton {
    position: absolute;
    bottom: 10%;
    left: 13%;
    color: #4c584d;
    font-size: 5vh;
    width: 74%;
    height: 15%;
    border-radius: 0.5em/0.5em;
    border: none;
}
button {
    color: #4c584d;
    font-size: 5vh;
    position: absolute;
    width: 17vw;
    height: 7vw;
    border-radius: 0.5em/0.5em;
    border: none;
    box-shadow: 6px 6px 10px 1px;
    transition: all 0.5s;
    font-family: 'Nunito', sans-serif;
}
button:hover {
    background-color: rgb(233, 135, 135);
    box-shadow: 6px 6px 0px 0.5px;
    transition: all 0.5s;
    cursor: pointer;
}

button:active {
    transition: 0.1s;
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px 0px;
}
</style>
