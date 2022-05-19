<template>
    <div class="game">
        <div class="timerDiv">
            <h1>Move time: {{ this.timerStep }}</h1>
        </div>
        <div class="playersZone">
            <div
                class="player"
                v-for="(player, idx) in playerList"
                :key="player"
            >
                <div v-if="idx + 1 != this.myId">
                    <div
                        :id="`position__${idx + 1 > this.myId ? idx : idx + 1}`"
                    >
                        <h2>{{ player.name }}</h2>
                        <button
                            @click="sendVote(idx + 1)"
                            v-if="
                                player.cardStatus != 'selecting...' && !isVoted
                            "
                        >
                            Vote
                        </button>
                        <img
                            :src="imgesUrlGetter(player.cardStatus)"
                            v-if="player.cardStatus != 'selecting...'"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="situationZone">
            Ситуація:<br />{{ situations[gameStep - 1] }}
        </div>
        <div
            class="cardsZone"
            v-show="
                this.playerList[Number(this.myId) - 1].cardStatus ==
                'selecting...'
            "
        >
            <div v-for="card in cards" :key="card">
                <img
                    @click="sendCard(card)"
                    class="cardImg"
                    :src="imgesUrlGetter(card)"
                />
            </div>
            <!--<button @click="sendCard()">Select</button>-->
        </div>
    </div>
</template>

<script>
import gameData from '../assets/playerData/gameData.js'
import myWs from '../assets/myWs/myWs.js'
export default {
    data() {
        return {
            playerList: [{ name: 'df', cardStatus: 'selecting...' }],
            situations: gameData.situations,
            cards: gameData.cards,
            ///timering
            timerStep: 20,
            gameStep: 1,
            timerId: undefined,
            isVoted: false,
        }
    },
    methods: {
        timesTimer(time = 30) {
            clearTimeout(this.timerId)
            this.timerStep = time - 1
            this.timerId = setInterval(() => {
                if (this.timerStep > 0) {
                    this.timerStep -= 1
                } else {
                    clearTimeout(this.timerId)
                }
            }, 1000)
        },
        myselfUpdatingFunc() {
            myWs.onmessage = (jsonMessage) => {
                jsonMessage = JSON.parse(jsonMessage.data)
                switch (jsonMessage.content) {
                    case 'card_status':
                        this.playerList.map((el, idx) => {
                            el.cardStatus = jsonMessage.cards[idx]
                            return el
                        })
                        break
                    case 'next_step':
                        this.playerList.map((el) => {
                            return (el.cardStatus = 'selecting...')
                        })
                        this.gameStep += 1
                        this.timerStep = 0
                        this.isVoted = false
                        this.timesTimer()
                        break
                    case 'end':
                        this.$router.push({
                            name: 'play',
                        })
                        alert(
                            `Game end! Winner is ${
                                jsonMessage.winner != ''
                                    ? jsonMessage.winner
                                    : 'nobody'
                            }`
                        )
                        break
                }
            }
        },
        sendCard(cardToSend) {
            console.log(cardToSend)
            myWs.send(
                JSON.stringify({
                    content: 'card',
                    card: cardToSend,
                    player_id: this.myId,
                    room_code: this.code,
                })
            )
            // удаляю карту которой походил //
            this.cards = this.cards.filter((card) => {
                return card != cardToSend
            })
        },
        sendVote(id) {
            this.isVoted = true
            myWs.send(
                JSON.stringify({
                    content: 'vote',
                    vote: id,
                    room_code: this.code,
                })
            )
        },
        imgesUrlGetter(cardName) {
            // return `${location.origin}/imahes_library.${cardName}`
            return `http://localhost:3000/images_library/${cardName}`
        },
    },
    props: {
        propPlayerNameList: {
            type: Array,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        myId: {
            type: [String, Number],
            required: true,
        },
    },
    created() {
        var timer = setInterval(() => {
            if (myWs.readyState != 0) {
                clearInterval(timer)
                this.myselfUpdatingFunc()
            }
        }, 100)
        this.playerList = this.propPlayerNameList.map((el) => {
            return {
                name: el,
                cardStatus: 'selecting...',
            }
        })
    },
    mounted() {
        this.timesTimer()
        var cads = Array.from(document.getElementsByClassName('cardImg'))

        var timering = setInterval(() => {
            if (cads[0].offsetWidth > 0) {
                clearInterval(timering)
                cads.forEach((el) => {
                    if (el.offsetWidth / el.offsetHeight > 1) {
                        el.width = el.width * 0.7
                    }
                })
            }
        }, 100)
    },
}
</script>
<style scoped>
.situationZone {
    position: absolute;
    font-size: 3vmin;
    width: 30vw;
    left: 34vw;
    height: 10vh;
    top: 27vh;
    padding: 2vw;
}
.playersZone h2 {
    display: inline-block;
    margin-right: 1vw;
}
.playersZone button {
    height: 3.5vh;
    width: 7vw;
    border: none;
    border-radius: 0.5em/0.5em;
    background-color: rgb(220, 234, 246);
}
.playersZone img {
    position: absolute;
    left: 0;
    top: 9vh;
    height: 18vh;
    border-radius: 0.2em/0.2em;
}
#position__1 {
    position: absolute;

    width: 25vw;
    height: 30vh;
    top: 7vh;
    left: 0;
}

#position__2 {
    position: absolute;

    width: 25vw;
    height: 30vh;
    top: 7vh;
    right: 0;
}
#position__3 {
    position: absolute;

    width: 25vw;
    height: 30vh;
    top: 40vh;
    left: 0;
}
#position__4 {
    position: absolute;

    width: 25vw;
    height: 30vh;
    top: 40vh;
    right: 0;
}
.cardsZone {
    position: absolute;
    height: 18vh;
    bottom: 0;
    width: 100vw;
}
.cardsZone div {
    display: inline-block;
}
.cardsZone img {
    height: 18vh;
}
.cardsZone img:hover {
    transition: all 0.1s ease-in-out 0s;
    transform: scale(1.1, 1.1);
}
</style>
