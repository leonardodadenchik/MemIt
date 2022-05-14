<template>
  <nav>
    <router-link to="/">home</router-link> |
    <router-link to="/about">about</router-link> |
    <router-link to="/play">play</router-link> |
    <router-link to="/create">create</router-link> |
    <router-link to="/join">join</router-link> |
    <router-link to="/wait">wait</router-link> |
    <router-link to="/game">game</router-link> |
    <router-link to="/joinbylink/ff1234d">link</router-link>
  </nav>
  <router-view />
</template>
<script>
import {} from "./assets/acccount/index";

export default {
  data() {
    return {};
  },
  methods() {},
  created() {},
};
</script>
