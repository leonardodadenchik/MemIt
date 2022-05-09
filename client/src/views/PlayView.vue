<template>
  <div class="play">
    <h1>This is a play page</h1>
    <nav>
      <router-link :to="{ name: 'create' }">create</router-link> |
      <router-link :to="{ name: 'join' }">join</router-link>
    </nav>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "PlayView",
  components: {},
  mounted() {},
};
</script>
