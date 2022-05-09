import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },

  {
    path: "/play",
    name: "play",
    component: () => import("../views/PlayView.vue"),
  },
  {
    path: "/create",
    name: "create",
    component: () => import("../views/CreateView.vue"),
  },
  {
    path: "/join",
    name: "join",
    component: () => import("../views/JoinView.vue"),
    props: true,
  },
  {
    path: "/connect",
    name: "connect",
    component: () => import("../views/notContent/connectingProc.vue"),
    props: true,
  },
  {
    path: "/joinbylink/:roomCode",
    name: "joinByLink",
    component: () => import("../views/notContent/JoinByLink.vue"),
  },
  {
    path: "/wait",
    name: "wait",
    component: () => import("../views/WaitView.vue"),
    props: true,
  },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/GameView.vue"),
    props: true,
  },
  {
    path: "/:pathMatch(.*)",
    name: "notFound",
    component: () => import("../views/NotFund/errorPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
