<template>
  <div class="join">
    <h1>This is a join page</h1>
    <!--room connectng-->

    <label>connect to the room,room code:</label><br />
    <input type="text" value="default_room" /><br /><br />

    <label>NickName:</label><br />
    <input type="text" value="den" /><br /><br />

    <!-- onclick="connect_to_room()"-->
    <input type="submit" value="connect" /><br /><br />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ConnectView",
  components: {},
  mounted() {},
};
</script>
