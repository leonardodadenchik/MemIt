"use strict";(self["webpackChunkclient"]=self["webpackChunkclient"]||[]).push([[602],{3691:function(e,t){const r=(location.origin.replace(/^http/,"ws")+":8814/").replace(":3000","").replace(":8080",""),i=new WebSocket(r);t["Z"]=i},602:function(e,t,r){r.r(t),r.d(t,{default:function(){return _}});var i=r(3396),o=r(7139);const a=e=>((0,i.dD)("data-v-6c9c2516"),e=e(),(0,i.Cn)(),e),s={class:"wait"},n=a((()=>(0,i._)("h1",null,"Wait for another players",-1))),c={class:"codeInformatin"},l={class:"playersModeration"},d={class:"roomPlayer"},p=["onClick"],y={class:"buttonZone"};function m(e,t,r,a,m,u){return(0,i.wg)(),(0,i.iD)("div",s,[n,(0,i._)("div",c,[(0,i._)("h2",null,"Your code is: "+(0,o.zw)(r.code),1),(0,i._)("button",{onClick:t[0]||(t[0]=e=>u.copyLink())},"Copy")]),(0,i._)("div",l,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(m.roomPlayers,((e,t)=>((0,i.wg)(),(0,i.iD)("div",{key:t,class:"playersBlocks"},[(0,i._)("div",d,[(0,i._)("p",null,(0,o.zw)(t+1)+" - "+(0,o.zw)(e),1),1==m.myid&&0!==t?((0,i.wg)(),(0,i.iD)("button",{key:0,onClick:e=>u.playerKick(t+1,!1)}," Kick ",8,p)):(0,i.kq)("",!0)])])))),128))]),(0,i._)("div",y,[1==m.myid&&m.roomPlayers.length>1?((0,i.wg)(),(0,i.iD)("button",{key:0,onClick:t[1]||(t[1]=e=>u.startMyGame())}," StartGame ")):(0,i.kq)("",!0),(0,i._)("button",{onClick:t[2]||(t[2]=e=>u.exitGame())},"Exit")])])}var u=r(3691),h={data(){return{myid:this.propMyId,roomPlayers:this.propPlayerList}},props:{propPlayerList:{type:Array,required:!0},code:{type:String,required:!0},propMyId:{type:[Number,String],required:!0}},methods:{myselfUpdatingFunc(){u.Z.onmessage=e=>{switch(e=JSON.parse(e.data),e.content){case"players_names":this.roomPlayers=e.nicknames,this.myid=e.player_id;break;case"start_game":this.gotGameStart();break;case"kick":this.$router.push({name:"join",params:{propCode:this.code,request:"You have been kicked from room, ggwp Nooooobby"}});break}}},gotGameStart(){this.$router.push({name:"game",params:{propPlayerNameList:this.roomPlayers,code:this.code,myId:this.myid}})},startMyGame(){u.Z.send(JSON.stringify({content:"start_game",room_code:this.code})),this.gotGameStart()},exitGame(){this.playerKick(this.myid,!0),this.$router.push({name:"join",params:{propCode:this.code,request:"exit?"}})},playerKick(e,t){u.Z.send(JSON.stringify({content:"delete_player",room_code:this.code,player_id:e,isExit:t}))},getJoinLink(){return`${location.origin}/joinByLink/${this.code}`},copyLink(){navigator.clipboard.writeText(this.getJoinLink())}},created(){var e=setInterval((()=>{0!=u.Z.readyState&&(clearInterval(e),this.myselfUpdatingFunc())}),100)}},k=r(89);const g=(0,k.Z)(h,[["render",m],["__scopeId","data-v-6c9c2516"]]);var _=g}}]);
//# sourceMappingURL=602.0c6785f3.js.map