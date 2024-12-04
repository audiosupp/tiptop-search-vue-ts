// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Search from '../components/Search.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/', component: Search, meta: { requiresAuth: true, title: 'Поиск'  } },
  { path: '/login', component: Login, meta: { title: 'Логин' } },
  { path: '/search', component: Search, meta: { requiresAuth: true, title: 'Поиск'  } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt') !== null; // Check if JWT exists in local storage
  if (to.path === '/' && !isAuthenticated) {
    next({ path: '/login' }); // Redirect to login if not authenticated on root path
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login' }); // Redirect to login if not authenticated for other routes
  } else {
    next(); // Proceed to the route
  }
  
});

export default router;
