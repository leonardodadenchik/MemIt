<template>
  <div class="wait">
    <h1>This is a wait page</h1>

    <div v-for="(player, idx) in roomPlayers" :key="idx" class="playersBlocks">
      <div class="roomPlayer">
        <p>{{ idx + 1 }} - {{ player }}</p>
        <button :id="idx + 1" @click="playerKick($event.currentTarget.id)">
          x
        </button>
      </div>
    </div>

    <br />

    <button @click="startMyGame">StartGame</button>
    <button @click="playerKick(myid)">Exit</button>
  </div>
</template>

<script>
import myWs from "../assets/myWs/myWs.js";
//import playerData from "../assets/playerData/playerData.js";

export default {
  data() {
    return {
      myid: this.propMyId,
      roomPlayers: this.propPlayerList,
    };
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
        jsonMessage = JSON.parse(jsonMessage.data);
        switch (jsonMessage.content) {
          case "players_names":
            this.roomPlayers = jsonMessage.nicknames;
            break;
          case "start_game":
            this.gotGameStart();
            break;
        }
      };
    },
    gotGameStart() {
      this.$router.push({
        name: "game",
        params: { playerNameList: this.roomPlayers, code: this.code },
      });
    },
    startMyGame() {
      myWs.send(
        JSON.stringify({
          content: "start_game",
          room_code: this.code,
          // eslint-disable-next-line
        }),
      );
      this.gotGameStart();
    },
    /*
    TODO: 1.Message onYourKick,
    TODO: 2.Check can player do kick, // sercver \ client
    TODO: 3.Make yourself kick,
    TODO: 4.IsKing(Leader) checking from backend
    TODO: 5.StartGame (get and start)
    */
    playerKick(eventData) {
      console.log(eventData);
      myWs.send(
        JSON.stringify({
          content: "delete_player",
          room_code: this.code,
          player_id: eventData,
          // eslint-disable-next-line
        }),
      );
    },
  },
  created() {
    if (!(this.propPlayerList && this.code)) {
      this.$router.push({
        path: "error",
      });
    }
    var timer = setInterval(() => {
      if (myWs.readyState != 0) {
        clearInterval(timer);
        this.myselfUpdatingFunc();
      }
    }, 100);
  },
};
</script>
