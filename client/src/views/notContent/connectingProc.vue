<template>
  <div></div>
</template>
<script>
import { myWs } from "../../assets/myWs/myWs.js";
import gameData from "../../assets/playerData/gameData.js";
import playerData from "../../assets/playerData/playerData.js";
export default {
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  created() {
    new Promise((resolve, reject) => {
      myWs.send(
        JSON.stringify({
          content: "connect_to_room",
          room_code: this.code,
          name: playerData.name,
          // eslint-disable-next-line
        }),
      );

      myWs.onmessage = (jsonMessage) => {
        jsonMessage = JSON.parse(jsonMessage.data);
        if (jsonMessage.content == "connectingAns") {
          jsonMessage.cards && jsonMessage.situations
            ? resolve([jsonMessage.cards, jsonMessage.situations])
            : reject(jsonMessage.status);
        }
      };
    })
      .then((CardsSituations) => {
        gameData.cards = CardsSituations[0];
        gameData.situations = CardsSituations[1];
        alert("connected");
      })
      .catch((reason) => {
        ["roomNotFound", "roomIsFool", "GameStarted"].includes(reason)
          ? this.$router.push({
              name: "join",
              params: {
                propCode: this.code,
                request: reason,
              },
            })
          : this.$router.push({
              path: "/error",
            });
      });
  },
};
</script>
