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
// @ is an alias to /src

export default {
  data() {
    return {
      code: this.propCode,
      name: "Dan",
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
        params: { code: this.code, playerData: this.name },
      });
    },
  },
};
</script>
