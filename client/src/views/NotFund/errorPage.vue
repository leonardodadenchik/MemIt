<template>
    <div class="err">
        <h1>Сторінка не знайдена</h1>
        <div class="buttonsBlock">
            <button @click="redirMethod('home')">
                Повернутися на головну сторінку
            </button>
            <h2>чи</h2>
            <button @click="redirMethod('play')">Грати</button>
        </div>
    </div>
</template>
<script>
export default {
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');
.err {
    font-family: 'Nunito', sans-serif;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1.5em/1.5em;
}
.buttonsBlock {
    font-family: 'Nunito', sans-serif;
    margin-left: -8vw;
}
.buttonsBlock button {
    font-family: 'Nunito', sans-serif;
    display: inline-block;
    border: none;
    border-radius: 1em/1em;
    font-size: 3vmin;
    padding: 1vmin;
    margin: 0 1vw;
}
.buttonsBlock h2 {
    display: inline-block;
}
button {
    color: #4c584d;
    font-size: 5vh;
    border-radius: 0.5em/0.5em;
    border: none;
    box-shadow: 6px 6px 10px 1px;
    transition: all 0.5s;
}
button:hover {
    background-color: rgb(233, 135, 135);
    box-shadow: 6px 6px 0px 0.5px;
    transition: all 0.5s;
    cursor: pointer;
}

button:active {
    transition: 0.1s;
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px 0px;
}
</style>
