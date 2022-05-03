<template>
  <div class="wait">
    <h1>This is a wait page</h1>
    <!--room waiting-->

    <!--here players names-->
    <div v-for="(player, idx) in roomPlayers" :key="idx" class="playersBlocks">
      <div class="roomPlayer">
        <p>{{ idx + 1 }} - {{ player }}</p>
        <button :id="idx">x</button>
      </div>
    </div>
    <br />

    <!--onclick="start_game()"-->
    <button>StartGame</button>
    <button>Exit</button>
  </div>
</template>

<script>
import myWs from "../assets/myWs/myWs.js";
import playerData from "../assets/playerData/playerData.js";

export default {
  data() {
    return {
      roomPlayers: this.propPlayerList || [playerData.name],
    };
  },
  // ? maby addishioinal props
  props: {
    propPlayerList: {
      type: Array,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  created() {
    const playersUpdateFunc = () => {
      myWs.onmessage = (jsonMessage) => {
        jsonMessage = JSON.parse(jsonMessage.data);
        switch (jsonMessage.content) {
          case "players_names":
            this.roomPlayers = jsonMessage.nicknames;
            break;
        }
      };
    };
    var timer = setInterval(() => {
      myWs.readyState == 0 ||
        (() => {
          playersUpdateFunc();
          clearInterval(timer);
        })();
    }, 10);
  },
};
</script>
