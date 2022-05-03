<template>
  <div></div>
</template>
<script>
import myWs from "../../assets/myWs/myWs.js";
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
      const connectMe = () => {
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
          switch (jsonMessage.content) {
            case "connectingAns":
              jsonMessage.cards && jsonMessage.situations
                ? ([gameData.cards, gameData.situations] = [
                    jsonMessage.cards,
                    jsonMessage.situations,
                  ])
                : reject(jsonMessage.status);
              break;
            case "players_names":
              resolve(jsonMessage.nicknames);
              break;
          }
        };
      };
      var timer = setInterval(() => {
        myWs.readyState == 0 ||
          (() => {
            connectMe();
            clearInterval(timer);
          })();
      }, 10);
    })
      .then((playerslist) => {
        this.$router.push({
          name: "wait",
          params: { propPlayerList: playerslist, code: this.code },
        });
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
          : console.error(reason);
      });
  },
};
</script>
