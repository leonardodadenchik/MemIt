<template>
  <div class="game">
    <div class="timerDiv">
      <h1>Move time: {{ this.timerStep }}</h1>
    </div>
    <div class="playersZone">
      <div class="player" v-for="(player, idx) in playerList" :key="player">
        <div v-if="idx + 1 != this.myId">
          <div :id="`position__${idx + 1 > this.myId ? idx : idx + 1}`">
            <h2>{{ player.name }}</h2>
            <!--<button
              @click="sendVote(idx + 1)"
              v-if="player.cardStatus != 'selecting...' && !isVoted"
            >
              Vote
            </button>-->
            <div class="usedCardDivenge">
              <div
                class="voteDivenge"
                @click="sendVote(idx + 1)"
                v-if="player.cardStatus != 'selecting...' && !isVoted"
              >
                <p>VOTE</p>
              </div>
              <img
                :src="imgesUrlGetter(player.cardStatus)"
                v-if="player.cardStatus != 'selecting...'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="situationZone">
      Ситуація:<br />{{ situations[gameStep - 1] }}
    </div>
    <!--      v-show="
        this.playerList[Number(this.myId) - 1].cardStatus == 'selecting...'
      "-->
    <div class="cardsZone">
      <img
        v-for="card in cards"
        :key="card"
        @click="sendCard(card)"
        class="cardImg"
        :src="imgesUrlGetter(card)"
      />
    </div>
    <img :src="imgesUrlGetter(mySelectedCard)" class="myCard" />
  </div>
</template>

<script>
import gameData from "../assets/playerData/gameData.js";
import myWs from "../assets/myWs/myWs.js";
export default {
  data() {
    return {
      // default
      playerList: [{ name: "df", cardStatus: "selecting..." }],
      situations: gameData.situations,
      cards: gameData.cards,
      ///timering
      timerStep: 20,
      gameStep: 1,
      timerId: undefined,
      isVoted: false,
      //for mySelectedCard
      mySelectedCard: "",
    };
  },
  methods: {
    timesTimer(time = 30) {
      clearTimeout(this.timerId);
      this.timerStep = time - 1;
      this.timerId = setInterval(() => {
        if (this.timerStep > 0) {
          this.timerStep -= 1;
        } else {
          clearTimeout(this.timerId);
        }
      }, 1000);
    },
    myselfUpdatingFunc() {
      myWs.onmessage = (jsonMessage) => {
        jsonMessage = JSON.parse(jsonMessage.data);
        switch (jsonMessage.content) {
          case "card_status":
            this.playerList.map((el, idx) => {
              el.cardStatus = jsonMessage.cards[idx];
              return el;
            });
            break;
          case "next_step":
            // delete move photos
            this.playerList.map((el) => {
              return (el.cardStatus = "selecting...");
            });
            //upadte game data
            this.gameStep += 1;
            this.timerStep = 0;
            //add appoutunity to vote
            this.isVoted = false;
            //hide my card
            var myCard = Array.from(document.getElementsByClassName("myCard"));
            myCard[0].style.bottom = `-300px`;
            //get cards back
            var cadsZone = Array.from(
              document.getElementsByClassName("cardsZone")
            );
            cadsZone[0].style.bottom = `-20px`;
            //reload timer
            this.timesTimer();
            break;
          case "end":
            // this.$router.push({
            //   name: "play",
            // });
            alert(
              `Game end! Winner is ${
                jsonMessage.winner != "" ? jsonMessage.winner : "nobody"
              }`
            );
            break;
        }
      };
    },
    cardsRecalcilating() {
      var cadsZone = Array.from(document.getElementsByClassName("cardsZone"));
      cadsZone[0].style.left = `${(100 - (this.cards.length * 5 + 2)) / 2.8}vw`;
    },
    sendCard: async function (cardToSend) {
      await myWs.send(
        JSON.stringify({
          content: "card",
          card: cardToSend,
          player_id: this.myId,
          room_code: this.code,
        })
      );
      // recalc left pos of deck
      var cadsZone = Array.from(document.getElementsByClassName("cardsZone"));
      cadsZone[0].style.bottom = `-300px`;
      // my card show
      this.mySelectedCard = cardToSend;
      var myCard = Array.from(document.getElementsByClassName("myCard"));
      myCard[0].style.bottom = `25px`;
      // удаляю карту которой походил //
      this.cards = this.cards.filter((el) => el != cardToSend);
      this.cardsRecalcilating();
    },
    sendVote(id) {
      this.isVoted = true;
      myWs.send(
        JSON.stringify({
          content: "vote",
          vote: id,
          room_code: this.code,
        })
      );
    },
    imgesUrlGetter(cardName) {
      // return `${location.origin}/imahes_library.${cardName}`
      return `http://localhost:3000/images_library/${cardName}`;
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
        clearInterval(timer);
        this.myselfUpdatingFunc();
      }
    }, 100);
    this.playerList = this.propPlayerNameList.map((el) => {
      return {
        name: el,
        cardStatus: "selecting...",
      };
    });
  },
  mounted() {
    this.timesTimer();
    //var cardzone = document.getElementsByClassName("cardsZone")[0];
    var timering = setInterval(() => {
      // card rebuildimage
      var cads = Array.from(document.getElementsByClassName("cardImg"));
      if (cads[0].offsetWidth > 0) {
        clearInterval(timering);
        cads.forEach((el) => {
          if (el.offsetWidth > el.offsetHeight) {
            el.classList.add("revetsedCard");
          } else {
            el.classList.add("verticalCard");
          }
        });
        this.cardsRecalcilating();

        //let baseCardHeight = 200;
        //let betweenCardDistance = 30;
        //var margLeft = 0;
      }
    }, 100);
  },
};
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
@keyframes cardAppearance {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.playersZone .usedCardDivenge {
  position: absolute;
  left: 0;
  height: 250px;
  max-width: 25vw;
}
.playersZone img {
  position: relative;
  z-index: 1;
  height: 250px;
  max-width: 25vw;
  border-radius: 17px/17px;
  animation: cardAppearance 0.2s linear 1 normal running 0s forwards;
}
.playersZone .voteDivenge {
  position: absolute;
  opacity: 0;
  z-index: 3;
  height: 250px;
  width: 100%;
  border-radius: 17px/17px;
}
.playersZone .voteDivenge p {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: 4vw;
  opacity: 1;
  color: rgb(168, 154, 154);
}
.playersZone .voteDivenge:hover {
  opacity: 0.5;
  background-color: whitesmoke;
  cursor: pointer;
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
  top: 47vh;
  left: 0;
}
#position__4 {
  position: absolute;

  width: 25vw;
  height: 30vh;
  top: 47vh;
  right: 0;
}
.cardsZone {
  z-index: 5;
  transition: all 0.4s ease-out;
  position: fixed;
  bottom: -20px;
  left: 28vw;
}

.cardsZone img {
  display: inline-flex;
  margin-right: -80px;
  transition: all 0.4s ease-out;
  bottom: 0;
  border-radius: 5%;
}
.cardsZone img:hover {
  z-index: 10;
  transform: scale(1.3, 1.3);
}
.revetsedCard {
  transform: rotate(-90deg);
  margin-bottom: 20px;
  width: 200px;
  height: 160px;
}
.revetsedCard:hover {
  box-shadow: 0px 30px 26px 16px rgba(34, 60, 80, 0.53);
  transform: rotate(0deg);
  margin-right: 0px;
  margin-bottom: 35px;
}
.verticalCard {
  transform: rotate(0deg);
  height: 200px;
  width: 160px;
}
.verticalCard:hover {
  box-shadow: 0px 65px 26px 16px rgba(34, 60, 80, 0.53);
  margin-bottom: 40px;
  margin-right: -0px;
}
.myCard {
  transition: all 0.4s ease-out;
  position: fixed;
  border-radius: 5%/5%;
  height: 250px;
  left: 35%;
  bottom: -300px;
}
</style>
