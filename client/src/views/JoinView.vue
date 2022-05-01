<template>
  <div class="join">
    <h1>This is a join page</h1>

    <label>Room code:</label><br />
    <input type="text" v-model="code" /><br /><br />

    <label>Nickname:</label><br />
    <input type="text" v-model="name" /><br /><br />

    <button @click="connectAttemp">Connect</button>
  </div>
</template>

<script>
import playerData from "../assets/playerData/playerData.js";
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
      required: true,
    },
    request: {
      type: Object,
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
