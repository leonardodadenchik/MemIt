<template>
    <div class="wrapper">
        <div id="first_block">
            <section>
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="wave wave3"></div>
                <div class="wave wave4"></div>
            </section>
            <div id="Memit_is">
                <h1><span id="MEMIT">MemIt</span>-це...</h1>
                <h2>
                    Та сама відома настільна гра про меми, яку ми зробили в
                    онлайн форматі. Тож швидше клиакайте своїх друзів, і гайда
                    грати!
                </h2>
            </div>
            <button id="play_button" @click="redirMethod('play')">Грати</button>
        </div>
        <div id="second_block">
            <h1>Трохи про нашу гру:</h1>
            <div id="about">
                <div>
                    <h2>Гра для веселої компанії!</h2>
                    <h3>
                        Одночасно у гру можуть грати від трьох до пьяти людей!
                        Тож кликай друзів!
                    </h3>
                </div>
                <div>
                    <h2>Гарний настрій!</h2>
                    <h3>
                        Гра легко грається, не потрібно читати складні правила,
                        і найголовніше - гра цікава та смішна!
                    </h3>
                </div>
                <div>
                    <h2>Креативність і перемога!</h2>
                    <h3>
                        Переможець обирається методом голосування, прояви
                        кмітливість і здивуй опонентів!
                    </h3>
                </div>
            </div>
        </div>
        <div id="third_block">
            <section id="wave_2">
                <div class="wave wave1"></div>
                <div class="wave wave2"></div>
                <div class="wave wave3"></div>
                <div class="wave wave4"></div>
            </section>
            <h1>Правила:</h1>
            <div id="rules">
                <h2>1.Долучися до кімнати, або створи свою</h2>
                <h2>
                    2.Чекай доки приєднаються інші гравці і адмін кімнати
                    розпочне гру
                </h2>
                <h2>
                    3.Гра почалася, подивись на ситуацію, і обери мем, котрий
                    найсмішніше описує ситуацію
                </h2>
                <h2>4.Дочекайся доки інші гравці оберуть картки</h2>
                <h2>5.Голосуй за найсмішнішу картинку</h2>
                <h2>6.Повторюй 3, 4 і 5 пункт, доки ситуації не закінчаться</h2>
                <h2>7.Дізнайся ім'я переможця!</h2>
            </div>
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
#Memit_is {
    width: 60%;
    text-align: left;
    margin-top: 15vh;
    margin-left: 5vw;
}
#MEMIT {
    font-size: 15vh;
}
#Memit_is h1 {
    font-size: 11vh;
}
#Memit_is h2 {
    width: 60%;
    font-size: 5vh;
}

#play_button {
    margin-top: 28vh;
    margin-right: 10vw;
}
button {
    font-family: 'Nunito', sans-serif;
    font-size: 15vh;
    width: 40vw;
    height: 30vh;
    border-radius: 0.5em/0.5em;
    border: none;
    box-shadow: 6px 6px 10px 1px;
    transition: all 0.5s;
    background-color: white;
    z-index: 1;
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

#first_block {
    background: #ecead1;
    background-image: linear-gradient(90deg, transparent 81px, transparent 84px),
        linear-gradient(#bbb 1px, transparent 0px),
        linear-gradient(90deg, #bbb 1px, transparent 0px);
    background-size: 100% 100%, 20px 20px, 20px 20px;
    background-position: 0 0, -1px -1px, -1px 1px;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    font-family: 'Nunito', sans-serif;
}
#second_block {
    width: 100%;
    height: 100vh;

    font-family: 'Nunito', sans-serif;
    text-align: center;
}

#second_block h1 {
    font-size: 11vh;
}
#second_block h2 {
    font-size: 6vh;
    margin-top: 16vh;
    text-decoration: underline;
}
#second_block h3 {
    font-size: 4vh;
}
#about {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
}
#about div {
    display: block;
    width: 25%;
}
#third_block {
    width: 100%;
    background: #ecead1;
    background-image: linear-gradient(90deg, transparent 81px, transparent 84px),
        linear-gradient(#bbb 1px, transparent 0px),
        linear-gradient(90deg, #bbb 1px, transparent 0px);
    background-size: 100% 100%, 20px 20px, 20px 20px;
    background-position: 0 0, -1px -1px, -1px 1px;
    font-family: 'Nunito', sans-serif;
    text-align: center;
    position: absolute;
    height: 120vh;
}
#third_block h1 {
    margin-top: 11vh;
    font-size: 11vh;
}
#third_block h2 {
    display: block;
    font-size: 5vh;
    margin-left: 3vw;
}
#rules {
    text-align: left;
    font-family: 'Nunito', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 87vh;
}

/*animation*/
* {
    margin: 0;
    padding: 0;
}
section {
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
}
#wave_2 .wave {
    transform: rotate(180deg);
    position: absolute;
    top: 0;
}
section .wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: url(https://i.postimg.cc/YqcvK11W/wave.png);
    background-size: 1000px 100px;
}
section .wave.wave1 {
    animation: animate 30s linear infinite;
    z-index: 1000;
    opacity: 1;
    animation-delay: 0s;
    bottom: 0;
}
section .wave.wave2 {
    animation: animate2 15s linear infinite;
    z-index: 999;
    opacity: 0.5;
    animation-delay: -5s;
    bottom: 10px;
}
section .wave.wave3 {
    animation: animate3 30s linear infinite;
    z-index: 998;
    opacity: 0.2;
    animation-delay: 2s;
    bottom: 15px;
}
section .wave.wave4 {
    animation: animate2 5s linear infinite;
    z-index: 997;
    opacity: 0.7;
    animation-delay: -5s;
    bottom: 10px;
}

@keyframes animate {
    0% {
        background-position-x: 0;
    }
    100% {
        background-position-x: 1000px;
    }
}
@keyframes animate2 {
    0% {
        background-position-x: 0;
    }
    100% {
        background-position-x: -1000px;
    }
}
</style>
