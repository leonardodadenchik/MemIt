<template>
  <div class="game">
    <h1>This is a game page</h1>
    <div class="playersZone">
      <div
        class="player"
        :id="`player__${idx}`"
        v-for="(player, idx) in playerList"
        :key="player"
      >
        <div v-if="idx + 1 != this.myId">
          {{ player.name }}
          <button>Vote</button>
          <img
            :src="imgesUrlGetter(player.cardStatus)"
            v-if="player.cardStatus != 'selecting...'"
          />
        </div>
      </div>
    </div>
    <div class="situationZone">{{ situations[gameStep - 1] }}</div>
    <div class="cardsZone">
      <select v-model="selected">
        <option v-for="card in cards" :key="card">{{ card }}</option>
      </select>
      <button @click="sendCard()">Select</button>
    </div>
  </div>
</template>

<script>
import gameData from "../assets/playerData/gameData.js";
import myWs from "../assets/myWs/myWs.js";
export default {
  data() {
    return {
      playerList: this.propPlayerNameList.map((el) => {
        return {
          name: el,
          cardStatus: "selecting...",
        };
        // eslint-disable-next-line
      }),
      situations: gameData.situations,
      cards: gameData.cards,
      selected: gameData.cards[0],
      gameStep: 1,
    };
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
  methods: {
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
          // eslint-disable-next-line
        }),
      );
    },
    imgesUrlGetter(cardName) {
      // return `location.origin/imahes_library.${cardName}`
      return `http://localhost:3000/images_library/${cardName}`;
    },
  },
  created() {
    var timer = setInterval(() => {
      if (myWs.readyState != 0) {
        clearInterval(timer);
        this.myselfUpdatingFunc();
      }
    }, 100);
    if (!(this.propPlayerNameList && this.code && this.myId)) {
      console.log("notallprops");
      this.$router.push({
        path: "error",
      });
    }
  },
};
</script>
<style scoped>
.player div {
  border: 3px solid grey;
  width: 30%;
  margin: 3px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}
.player img {
  height: 100px;
}
.situationZone {
  width: 40%;
  border: 3px solid red;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}
.cardsZone {
  margin-top: 50px;
}
</style>
