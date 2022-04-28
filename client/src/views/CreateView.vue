<template>
  <div class="create">
    <h1>This is a create page</h1>
    <!--room making-->
    <label>Player count:</label><br />
    <input max="5" min="2" type="number" value="3" /><br /><br />

    <label>Card count:</label><br />
    <input max="7" min="4" type="number" value="4" /><br /><br />

    <label>Situation count:</label><br />
    <input max="4" min="1" type="number" value="3" /><br /><br />

    <!--onclick="send_room_data()"-->
    <input type="submit" value="Make room" /><br /><br />
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "CreateView",
  components: {},
};
</script>
