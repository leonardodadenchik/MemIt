<template>
  <div></div>
</template>
<script>
import { myWs } from "../../../myWs/myWs.js";

export default {
  props: {
    code: {
      type: String,
      required: true,
    },
    playerData: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.code, this.playerData);
    new Promise((resolve, reject) => {
      myWs.send(
        JSON.stringify({
          content: "connect_to_room",
          room_code: this.code,
          name: this.playerData,
          // eslint-disable-next-line
        }),
      );
      /*
      myWs.onmessage = (jsonMessage) => {
        jsonMessage = JSON.parse(jsonMessage.data);

        ! on message dont work!!!!!
        TODO: after backend fix
        //wait for CARDS && SITUATIONS and redirect to wait page

      };
      */
      console.log(this.code, this.playerData);
      reject();
    });
    /*
    TODO: finsh this blocks after BACKEND changes
      .then()
      .catch();
      // cathch block resend to join with promice usage
    */
  },
};
</script>
