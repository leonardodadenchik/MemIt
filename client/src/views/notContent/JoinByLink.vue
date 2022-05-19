<template>
    <div></div>
</template>
<script>
export default {
    created() {
        this.$router.push({
            name: 'join',
            params: {
                propCode: `${this.$route.params.roomCode}`,
            },
        })
    },
}
</script>
