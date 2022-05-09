<template>
  <div class="create">
    <h1>This is a create page</h1>
    <!--room making-->
    <label>Card count:</label><br />
    <input max="7" min="4" type="number" v-model="cardCount" /><br /><br />

    <label>Situation count:</label><br />
    <input max="4" min="1" type="number" v-model="situationCount" /><br /><br />

    <!--onclick="send_room_data()"-->
    <button @click="roomCreatereques">Make room</button>
  </div>
</template>

<script>
import myWs from "../assets/myWs/myWs.js";
export default {
  data() {
    return {
      cardCount: 4,
      situationCount: 3,
    };
  },
  methods: {
    roomCreatereques() {
      new Promise((resolve, reject) => {
        myWs.send(
          JSON.stringify({
            content: "room_creation",
            room_settings: {
              player_count: "5",
              card_count: this.cardCount,
              sit_count: this.situationCount,
            },
            // eslint-disable-next-line
          }),
        );
        myWs.onmessage = (jsonMessage) => {
          jsonMessage = JSON.parse(jsonMessage.data);
          if (jsonMessage.content == "code_for_creator") {
            if (jsonMessage.code) {
              resolve(jsonMessage.code);
            } else {
              reject();
            }
          }
        };
      })
        .then((code) => {
          this.$router.push({
            name: "connect",
            params: { code: code },
          });
        })
        .catch(() => {
          this.$router.push({
            path: "/error",
          });
        });
    },
  },
};
</script>
