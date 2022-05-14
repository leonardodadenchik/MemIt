<template>
  <div class="game">
    <h1>This is a game page {{ this.timerStep }}</h1>

    <div class="playersZone">
      <div class="player" v-for="(player, idx) in playerList" :key="player">
        <div v-if="idx + 1 != this.myId">
          <p>{{ player.name }}</p>
          <button
            @click="sendVote(idx + 1)"
            v-if="player.cardStatus != 'selecting...'"
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
    <div class="situationZone">{{ situations[gameStep - 1] }}</div>
    <div
      class="cardsZone"
      v-show="
        this.playerList[Number(this.myId) - 1].cardStatus == 'selecting...'
      "
    >
      <select v-model="selected">
        <option v-for="card in cards" :key="card">{{ card }}</option>
      </select>
      <button @click="sendCard()">Select</button>
    </div>
  </div>
</template>

<script>
/*
TODO: убрать 1 next_step(ss)
*/
import gameData from "../assets/playerData/gameData.js";
import myWs from "../assets/myWs/myWs.js";
export default {
  data() {
    return {
      playerList: { name: "df", cardStatus: "selecting..." },
      situations: gameData.situations,
      cards: gameData.cards,
      selected: "0,jpg" || gameData.cards[0],
      ///timering
      timerStep: 20,
      gameStep: 1,
      timerId: undefined,
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
            this.playerList.map((el) => {
              return (el.cardStatus = "selecting...");
            });
            console.log("next step");
            this.gameStep += 1;
            this.timerStep = 0;
            this.timesTimer();
            break;
          case "end":
            console.log("end");
            console.log(jsonMessage.winner);
            break;
        }
      };
    },
    sendCard() {
      myWs.send(
        JSON.stringify({
          content: "card",
          card: this.selected,
          player_id: this.myId,
          room_code: this.code,
        })
      );
      // удаляю карту которой походил //
      this.cards = this.cards.filter((card) => {
        return card != this.selected;
      });
      this.selected = this.cards[0];
    },
    sendVote(id) {
      myWs.send(
        JSON.stringify({
          content: "vote",
          vote: id,
          room_code: this.code,
        })
      );
    },
    imgesUrlGetter(cardName) {
      // return `location.origin/imahes_library.${cardName}`
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
  },
};
</script>
<style scoped>
.player div {
  border: 3px solid grey;
  width: 30%;
  margin: 3px;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 10px;
}
.player img {
  height: 100px;
}
.situationZone {
  width: 40%;
  border: 3px solid red;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 10px;
}
.cardsZone {
  margin-top: 50px;
}
</style>
