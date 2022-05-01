<template>
  <div class="wait">
    <h1>This is a wait page</h1>
    <!--room waiting-->

    <!--here players names-->
    <div v-for="player in players" :key="player.name">
      <div class="player">{{ player.name }}</div>
    </div>
    <br />

    <!--onclick="start_game()"-->
    <input type="submit" value="start game" /><br /><br />
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "WaitView",
  components: {},
  data() {
    return {
      players: [
        {
          name: "1",
        },
        {
          name: "2",
        },
        {
          name: "3",
        },
        {
          name: "4",
        },
      ],
    };
  },
  mounted() {},
};
</script>
