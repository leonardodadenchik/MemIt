<template>
  <button @click="redirMethod('play')" class="backButton">&#8666;</button>
  <div class="join">
    <h1>Join to room</h1>
    <div class="placeHolders">
      <h3 v-if="!!request">{{ request }}</h3>

      <input type="text" placeholder="Code" v-model="code" />

      <input type="text" placeholder="Nickname" v-model="name" />
    </div>

    <button class="connectButton" @click="connectAttemp">Connect</button>
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
      required: false,
    },
    request: {
      type: String,
      required: false,
    },
  },
  methods: {
    redirMethod(where) {
      this.$router.push({
        name: where,
      });
    },
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
<style scoped>
textarea:focus,
input:focus {
  outline: none;
}

.join {
  position: absolute;
  position: absolute;
  background-color: #a5d3d4;
  height: 70vh;
  width: 30vw;
  left: 35vw;
  top: 15vh;
  border-radius: 1.5em/1.5em;
}
.join h1 {
  color: #4c584d;
  font-size: 5vh;
  padding-top: 6vh;
  text-align: center;
}
.join h3 {
  color: #cd7b7b;
  font-size: 3vh;
  text-align: center;
}

input {
  font-size: 2.2vmin;
  padding: 4%;
  width: 66%;
  height: 10%;
  margin-left: 13%;
  border-radius: 1em/1em;
  border: none;
}
input:last-child {
  margin-top: 10%;
}
.backButton {
  position: fixed;
  top: 0%;
  left: 0%;
  border-radius: 50%;
  border: none;
  background-color: rgb(197, 244, 174);
  color: #4c584d;
  width: 50px;
  height: 50px;
}
.connectButton {
  position: absolute;
  bottom: 10%;
  left: 13%;
  color: #4c584d;
  font-size: 5vh;
  width: 74%;
  height: 15%;
  border-radius: 0.5em/0.5em;
  border: none;
}
button:hover {
  background-color: rgb(233, 135, 135);
  cursor: pointer;
}
</style>
