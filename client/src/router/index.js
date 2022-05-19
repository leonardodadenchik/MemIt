import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
    },
    {
        path: '/play',
        name: 'play',
        component: () => import('../views/PlayView.vue'),
    },
    {
        path: '/create',
        name: 'create',
        component: () => import('../views/CreateView.vue'),
    },
    {
        path: '/join',
        name: 'join',
        component: () => import('../views/JoinView.vue'),
        props: true,
    },
    {
        path: '/connect',
        name: 'connect',
        component: () => import('../views/notContent/connectingProc.vue'),
        props: true,
        beforeEnter(to, from) {
            if (from.name !== 'create' && from.name !== 'join') {
                console.log(from)
                return { path: 'error' }
            }
        },
    },
    {
        path: '/joinbylink/:roomCode',
        name: 'joinByLink',
        component: () => import('../views/notContent/JoinByLink.vue'),
    },
    {
        path: '/wait',
        name: 'wait',
        component: () => import('../views/WaitView.vue'),
        props: true,
        beforeEnter(to, from) {
            if (from.name !== 'connect') {
                return { path: 'error' }
            }
        },
    },
    {
        path: '/game',
        name: 'game',
        component: () => import('../views/GameView.vue'),
        props: true,
        beforeEnter(to, from) {
            if (from.name !== 'wait') {
                return { path: 'error' }
            }
        },
    },
    {
        path: '/:pathMatch(.*)',
        name: 'notFound',
        component: () => import('../views/NotFund/errorPage.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
