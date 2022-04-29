import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/play",
    name: "play",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/PlayView.vue"),
  },
  {
    path: "/create",
    name: "create",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CreateView.vue"),
  },
  {
    path: "/join",
    name: "join",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/JoinView.vue"),
    props: true,
  },
  {
    path: "/connect",
    name: "connect",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/notContent/connectingProc.vue"
      ),
    props: true,
  },
  {
    path: "/joinbylink/:roomCode",
    name: "joinByLink",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/notContent/JoinByLink.vue"
      ),
  },
  {
    path: "/wait",
    name: "wait",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/WaitView.vue"),
  },
  {
    path: "/game",
    name: "game",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/GameView.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    name: "notFound",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/NotFund/errorPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
