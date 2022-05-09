<template>
  <div class="join">
    <h1>This is a join page</h1>

    <label>Room code:</label><br />
    <input type="text" v-model="code" /><br />
    <div v-if="!!request">{{ request }}</div>
    <br v-if="!!!request" /><br />

    <label>Nickname:</label><br />
    <input type="text" v-model="name" /><br /><br />

    <button @click="connectAttemp">Connect</button>
  </div>
</template>

<script>
import playerData from "../assets/playerData/playerData.js";
//import myWs from "../assets/myWs/myWs.js";
//myWs.onmessage = () => {};
export default {
  data() {
    return {
      code: this.propCode,
      name: playerData.name,
    };
  },
  props: {
    propCode: {
      type: String,
      required: false,
    },
    request: {
      type: String,
      required: false,
    },
  },
  methods: {
    connectAttemp() {
      this.$router.push({
        name: "connect",
        params: { code: this.code },
      });
    },
  },
  watch: {
    name(newVal) {
      playerData.name = newVal;
    },
  },
};
</script>
