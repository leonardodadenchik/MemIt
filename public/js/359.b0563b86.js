"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[359],{3691:function(e,t){const n=location.origin.replace(/^http/,"ws"),s=new WebSocket(n);t["Z"]=s},3566:function(e,t){t["Z"]={cards:void 0,situations:void 0}},8877:function(e,t){t["Z"]={name:"Player",post:"example.@gmail.com"}},7359:function(e,t,n){n.r(t),n.d(t,{default:function(){return p}});var s=n(3396);function r(e,t,n,r,a,o){return(0,s.wg)(),(0,s.iD)("div")}var a=n(3691),o=n(3566),c=n(8877),i={props:{code:{type:String,required:!0}},created(){new Promise(((e,t)=>{const n=()=>{a.Z.send(JSON.stringify({content:"connect_to_room",room_code:this.code,name:c.Z.name})),a.Z.onmessage=n=>{switch(n=JSON.parse(n.data),n.content){case"connectingAns":n.cards&&n.situations?[o.Z.cards,o.Z.situations]=[n.cards,n.situations]:t(n.status);break;case"players_names":e(n.nicknames);break}}};var s=setInterval((()=>{0!=a.Z.readyState&&(clearInterval(s),n())}),100)})).then((e=>{this.$router.push({name:"wait",params:{propPlayerList:e,code:this.code,propMyId:e.length}})})).catch((e=>{["Кімната не існує","Кімната переповнена","Гра вже почалася"].includes(e)?this.$router.push({name:"join",params:{propCode:this.code,request:e}}):this.$router.push({path:"error"})}))}},u=n(89);const d=(0,u.Z)(i,[["render",r]]);var p=d}}]);
//# sourceMappingURL=359.b0563b86.js.map