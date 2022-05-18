<template>
  <div class="home">
    <h1>This is a Home&Abuot page</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis voluptas
      totam saepe pariatur voluptatum, accusamus officiis nihil minima aperiam
      placeat accusantium reprehenderit ipsam nostrum perferendis dicta nesciunt
      cum eius aut?
    </p>
    <button @click="redirMethod('play')">Play?</button>
  </div>
</template>

<script>
// @ is an alias to /src

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
