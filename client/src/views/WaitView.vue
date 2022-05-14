<template>
  <div class="wait">
    <h1>This is a wait page</h1>
    <p>Your code is: {{ code }}</p>
    <button @click="copyLink()">copyLink</button>
    <hr />
    <div v-for="(player, idx) in roomPlayers" :key="idx" class="playersBlocks">
      <div class="roomPlayer">
        <p>{{ idx + 1 }} - {{ player }}</p>
        <button
          v-if="myid == 1 && idx !== 0"
          @click="playerKick(idx + 1, false)"
        >
          x
        </button>
      </div>
    </div>

    <br />

    <button v-if="myid == 1 && roomPlayers.length > 1" @click="startMyGame()">
      StartGame
    </button>
    <button @click="exitGame()">Exit</button>
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
            this.myid = jsonMessage.player_id;
            break;
          case "start_game":
            this.gotGameStart();
            break;
          case "kick":
            this.$router.push({
              name: "join",
              params: {
                propCode: this.code,
                request: "You have been kicked from room, ggwp Nooooobby",
              },
            });
            break;
        }
      };
    },
    gotGameStart() {
      this.$router.push({
        name: "game",
        params: {
          propPlayerNameList: this.roomPlayers,
          code: this.code,
          myId: this.myid,
        },
      });
    },
    startMyGame() {
      myWs.send(
        JSON.stringify({
          content: "start_game",
          room_code: this.code,
        })
      );
      this.gotGameStart();
    },
    /*
    TODO: 1.Message Exit // need backend assist
    */
    exitGame() {
      this.playerKick(this.myid, true);
      this.$router.push({
        name: "join",
        params: { propCode: this.code, request: "exit?" },
      });
    },
    playerKick(id, isExit) {
      myWs.send(
        JSON.stringify({
          content: "delete_player",
          room_code: this.code,
          player_id: id,
          isExit: isExit,
        })
      );
    },
    getJoinLink() {
      return `${location.origin}/joinByLink/${this.code}`;
    },
    copyLink() {
      navigator.clipboard.writeText(this.getJoinLink());
    },
  },
  created() {
    var timer = setInterval(() => {
      if (myWs.readyState != 0) {
        clearInterval(timer);
        this.myselfUpdatingFunc();
      }
    }, 100);
  },
};
</script>
