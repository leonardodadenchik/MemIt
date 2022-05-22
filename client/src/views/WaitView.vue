<template>
    <div class="wait">
        <h1>Очікування гравців</h1>
        <div class="codeInformatin">
            <h2>Код кімнати: {{ code }}</h2>
            <button @click="copyLink()">Копіювати посилання</button>
        </div>
        <div class="playersModeration">
            <div
                v-for="(player, idx) in roomPlayers"
                :key="idx"
                class="playersBlocks"
            >
                <div class="roomPlayer">
                    <p>{{ idx + 1 }} - {{ player }}</p>
                    <button
                        v-if="myid == 1 && idx !== 0"
                        @click="playerKick(idx + 1, false)"
                    >
                        Видалити
                    </button>
                </div>
            </div>
        </div>
        <div class="buttonZone">
            <button
                v-if="myid == 1 && roomPlayers.length > 1"
                @click="startMyGame()"
            >
                Розпочати гру
            </button>
            <button @click="exitGame()">Вийти</button>
        </div>
    </div>
</template>

<script>
import myWs from '../assets/myWs/myWs.js'

export default {
    data() {
        return {
            myid: this.propMyId,
            roomPlayers: this.propPlayerList,
            timesDestroyPage: -1,
        }
    },
    props: {
        propPlayerList: {
            type: Array,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        propMyId: {
            type: [Number, String],
            required: true,
        },
    },
    methods: {
        myselfUpdatingFunc() {
            myWs.onmessage = (jsonMessage) => {
                jsonMessage = JSON.parse(jsonMessage.data)
                switch (jsonMessage.content) {
                    case 'players_names':
                        this.roomPlayers = jsonMessage.nicknames
                        this.myid = jsonMessage.player_id
                        break
                    case 'start_game':
                        this.gotGameStart()
                        break
                    case 'kick':
                        this.$router.push({
                            name: 'join',
                            params: {
                                propCode: this.code,
                                request: 'Ти був вигнаний з кімнати',
                            },
                        })
                        break
                }
            }
            window.onbeforeunload = function () {
                this.playerKick(this.myid, true)
            }
        },
        gotGameStart() {
            this.$router.push({
                name: 'game',
                params: {
                    propPlayerNameList: this.roomPlayers,
                    code: this.code,
                    myId: this.myid,
                },
            })
        },
        startMyGame() {
            myWs.send(
                JSON.stringify({
                    content: 'start_game',
                    room_code: this.code,
                })
            )
            this.gotGameStart()
        },
        exitGame() {
            this.playerKick(this.myid, true)
            this.$router.push({
                name: 'join',
                params: { propCode: this.code, request: 'впевненний?' },
            })
        },
        playerKick(id, isExit) {
            myWs.send(
                JSON.stringify({
                    content: 'delete_player',
                    room_code: this.code,
                    player_id: id,
                    isExit: isExit,
                })
            )
        },
        getJoinLink() {
            return `${location.origin}/joinByLink/${this.code}`
        },
        copyLink() {
            navigator.clipboard.writeText(this.getJoinLink())
        },
    },
    created() {
        var timer = setInterval(() => {
            if (myWs.readyState != 0) {
                clearInterval(timer)
                this.myselfUpdatingFunc()
            }
        }, 100)
    },
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
.wait {
    font-family: 'Nunito', sans-serif;
    position: absolute;
    background-color: #a5d3d4;
    height: 75vh;
    width: 50vw;
    left: 25vw;
    top: 13vh;
    border-radius: 1.5em/1.5em;
}
.wait h1 {
    color: #4c584d;
    font-size: 5vh;
    padding-top: 3vh;
    text-align: center;
}
.codeInformatin h2 {
    display: inline-block;
    color: #4c584d;
    font-size: 2vmax;
    padding-left: 11vw;
    padding-right: 1vw;
}
.codeInformatin button {
    font-family: 'Nunito', sans-serif;
    position: relative;
    top: -0.6vh;
    display: inline-block;
    color: #4c584d;
    font-size: 2vh;
    width: 14vw;
    height: 4vh;
    border-radius: 0.5em/0.5em;
    border: none;
}
.playersModeration {
    font-family: 'Nunito', sans-serif;
    position: absolute;
    top: 25vh;
    left: 11vw;
}
.playersModeration .roomPlayer {
    position: relative;
    font-size: 3vh;
    width: 30vw;
    height: 7vh;
    border-bottom: 2px solid black;
}
.playersModeration .roomPlayer p {
    display: inline-block;
}
.playersModeration .roomPlayer button {
    font-family: 'Nunito', sans-serif;
    position: absolute;
    right: 1.8vw;
    top: 2.5vh;
    color: #4c584d;
    font-size: 2vh;
    width: 10vw;
    height: 4vh;
    border-radius: 0.5em/0.5em;
    border: none;
}
.buttonZone {
    position: absolute;
    bottom: 4vh;
    left: 5vw;
    width: 40vw;
    height: 5vh;
}
.buttonZone button {
    font-family: 'Nunito', sans-serif;
    position: relative;
    top: -0.6vh;
    display: inline-block;
    color: #4c584d;
    font-size: 2vh;
    width: 10vw;
    height: 5vh;
    border-radius: 0.5em/0.5em;
    border: none;
}
.buttonZone button:last-child {
    position: absolute;
    top: -0.6vh;
    right: 0vw;
    display: inline-block;
    color: #4c584d;
    font-size: 2vh;
    width: 10vw;
    height: 5vh;
    border-radius: 0.5em/0.5em;
    border: none;
}
button {
    color: #4c584d;
    font-size: 5vh;
    position: absolute;
    width: 17vw;
    height: 7vh;
    border-radius: 0.5em/0.5em;
    border: none;
    box-shadow: 3px 3px 5px 1px;
    transition: all 0.5s;
}
button:hover {
    background-color: rgb(233, 135, 135);
    box-shadow: 3px 3px 0px 0.5px;
    transition: all 0.5s;
    cursor: pointer;
}

button:active {
    transition: 0.1s;
    transform: translate(3px, 3px);
    box-shadow: 0px 0px 0px 0px;
}
</style>
