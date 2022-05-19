<template>
    <div></div>
</template>
<script>
import myWs from '../../assets/myWs/myWs.js'
import gameData from '../../assets/playerData/gameData.js'
import playerData from '../../assets/playerData/playerData.js'
export default {
    props: {
        code: {
            type: String,
            required: true,
        },
    },
    created() {
        new Promise((resolve, reject) => {
            const connectMe = () => {
                myWs.send(
                    JSON.stringify({
                        content: 'connect_to_room',
                        room_code: this.code,
                        name: playerData.name,
                    })
                )
                myWs.onmessage = (jsonMessage) => {
                    jsonMessage = JSON.parse(jsonMessage.data)
                    switch (jsonMessage.content) {
                        case 'connectingAns':
                            jsonMessage.cards && jsonMessage.situations
                                ? ([gameData.cards, gameData.situations] = [
                                      jsonMessage.cards,
                                      jsonMessage.situations,
                                  ])
                                : reject(jsonMessage.status)
                            break
                        case 'players_names':
                            resolve(jsonMessage.nicknames)
                            break
                    }
                }
            }

            var timer = setInterval(() => {
                if (myWs.readyState != 0) {
                    clearInterval(timer)
                    connectMe()
                }
            }, 100)
        })
            .then((playerNameList) => {
                this.$router.push({
                    name: 'wait',
                    params: {
                        propPlayerList: playerNameList,
                        code: this.code,
                        propMyId: playerNameList.length,
                    },
                })
            })
            .catch((reason) => {
                ;[
                    'Кімната не існує',
                    'Кімната переповнена',
                    'Гра вже почалася',
                ].includes(reason)
                    ? this.$router.push({
                          name: 'join',
                          params: {
                              propCode: this.code,
                              request: reason,
                          },
                      })
                    : this.$router.push({
                          path: 'error',
                      })
            })
    },
}
</script>
