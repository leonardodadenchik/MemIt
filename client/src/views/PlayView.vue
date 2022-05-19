<template>
    <div class="play">
        <h1>Зіграємо?</h1>
        <button @click="redirMethod('create')">Створити</button>
        <button @click="redirMethod('join')">Приєднатися</button>
    </div>
</template>

<script>
export default {
    name: 'PlayView',
    methods: {
        redirMethod(where) {
            this.$router.push({
                name: where,
            })
        },
    },
}
</script>

<style scoped>
.play {
    position: absolute;
    background-color: #a5d3d4;
    height: 60vh;
    width: 60vw;
    left: 20vw;
    top: 20vh;
    border-radius: 1em/1em;
}
.play h1 {
    color: #4c584d;
    font-size: 13vh;
    padding-top: 7vh;
    text-align: center;
}
.play button {
    color: #4c584d;
    font-size: 5vh;
    position: absolute;
    width: 17vw;
    height: 7vw;
    border-radius: 0.5em/0.5em;
    border: none;
    top: 38vh;
    box-shadow: 6px 6px 10px 1px;
    transition: all 0.5s;
}
.play button:hover {
    background-color: rgb(233, 135, 135);
    box-shadow: 6px 6px 0px 0.5px;
    transition: all 0.5s;
    cursor: pointer;
}

.play button:active {
    transition: 0.1s;
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px 0px;
}
.play button:nth-child(2) {
    left: 10vw;
}
.play button:last-child {
    right: 10vw;
}
</style>
