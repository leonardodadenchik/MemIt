<template>
  <div class="play">
    <h1>Play?</h1>
    <button @click="redirMethod('create')">Create</button>
    <button @click="redirMethod('join')">Join</button>
  </div>
</template>

<script>
export default {
  name: "PlayView",
  methods: {
    redirMethod(where) {
      this.$router.push({
        name: where,
      });
    },
  },
};
</script>

<style scoped>
.play {
  position: absolute;
  background-color: #a5d3d4;
  height: 60vh;
  width: 60vw;
  left: 20vw;
  top: 20vh;
  border-radius: 1.5em/1.5em;
}
.play h1 {
  color: #4c584d;
  font-size: 13vh;
  padding-top: 7vh;
  text-align: center;
}
.play button {
  color: #4c584d;
  font-size: 5vh;
  position: absolute;
  width: 17vw;
  height: 7vw;
  border-radius: 0.5em/0.5em;
  border: none;
  top: 38vh;
}
.play button:hover {
  background-color: rgb(233, 135, 135);
  cursor: pointer;
}
.play button:nth-child(2) {
  left: 10vw;
}
.play button:last-child {
  right: 10vw;
}
</style>
