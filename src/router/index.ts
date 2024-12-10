// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/Index.vue';
import Login from '../components/Login.vue';

const routes = [
  {
    path: '/',
    component: Index,
    meta: { requiresAuth: true, title: 'Поиск' },
  },
  { path: '/login', component: Login, meta: { title: 'Логин' } },
  {
    path: '/search',
    component: Index,
    meta: { requiresAuth: true, title: 'Поиск' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt') !== null;
  if (to.path === '/' && !isAuthenticated) {
    next({ path: '/login' });
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;
