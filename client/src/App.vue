<template>
    <!--
  <nav>
    <router-link to="/">home</router-link> |
    <router-link to="/play">play</router-link> |
    <router-link to="/create">create</router-link> |
    <router-link to="/join">join</router-link> |
    <router-link to="/wait">wait</router-link> |
    <router-link to="/game">game</router-link> |
    <router-link to="/joinbylink/ff1234d">link</router-link>
  </nav>-->
    <router-view />
</template>
<script>
export default {
    data() {
        return {}
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
body {
    font-family: 'Nunito', sans-serif;
}
</style>
