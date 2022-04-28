<template>
  <div class="wait">
    <h1>This is a wait page</h1>
    <!--room waiting-->

    <!--here players names-->
    <div id="nicknames">here players names</div>
    <br />

    <!--onclick="start_game()"-->
    <input type="submit" value="start game" /><br /><br />
  </div>
</template>

<script>
// @ is an alias to /src
import { myWs } from "/myWs/myWs.js";
export default {
  name: "WaitView",
  components: {},
  data() {
    return {
      roomCode: "",
      myName: "",
    };
  },
  mounted() {
    myWs.send(
      JSON.stringify({
        content: "connect_to_room",
        room_code: this.roomCode,
        name: this.myName,
        // eslint-disable-next-line
      }),
    );
  },
};
</script>
