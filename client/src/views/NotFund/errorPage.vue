<template>
  <div class="err">
    <h1>Page Not Found</h1>
    <div class="buttonsBlock">
      <button @click="redirMethod('home')">Back to home Page</button>
      <h2>or</h2>
      <button @click="redirMethod('play')">Play</button>
    </div>
  </div>
</template>
<script>
export default {
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
.err {
  position: absolute;
  left: 40vw;
  top: 20vh;
  border-radius: 1.5em/1.5em;
}
.buttonsBlock {
  margin-left: -5vw;
}
.buttonsBlock button {
  display: inline-block;
  border: none;
  border-radius: 1em/1em;
  font-size: 3vmin;
  padding: 1vmin;
  margin: 0 1vw;
}
.buttonsBlock h2 {
  display: inline-block;
}
button:hover {
  background-color: rgb(233, 135, 135);
  cursor: pointer;
}
</style>
