<template>
  <div class="game">
    <h1>This is a game page</h1>
  </div>
</template>

<script>
export default {
  props: {
    playerNameList: {
      type: Array,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
};
</script>
