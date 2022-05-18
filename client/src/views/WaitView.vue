<template>
  <div class="wait">
    <h1>Wait for another players</h1>
    <div class="codeInformatin">
      <h2>Your code is: {{ code }}</h2>
      <button @click="copyLink()">Copy</button>
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
            Kick
          </button>
        </div>
      </div>
    </div>
    <div class="buttonZone">
      <button v-if="myid == 1 && roomPlayers.length > 1" @click="startMyGame()">
        StartGame
      </button>
      <button @click="exitGame()">Exit</button>
    </div>
  </div>
</template>

<script>
import myWs from "../assets/myWs/myWs.js";

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
<style scoped>
.wait {
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
  position: relative;
  top: -0.6vh;
  display: inline-block;
  color: #4c584d;
  font-size: 2vh;
  width: 10vw;
  height: 4vh;
  border-radius: 0.5em/0.5em;
  border: none;
}
.playersModeration {
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
  position: absolute;
  right: 1.8vw;
  top: 2.5vh;
  color: #4c584d;
  font-size: 2vh;
  width: 7vw;
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
button:hover {
  background-color: rgb(233, 135, 135);
  cursor: pointer;
}
</style>
