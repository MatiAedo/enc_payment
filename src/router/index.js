import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AdminLogin from '../views/AdminLogin.vue';
import UserLogin from '../views/UserLogin.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import UserDashboard from '../views/UserDashboard.vue';
import Register from '../views/Register.vue';

const routes = [
  { path: '/', name: 'HomeEnc', component: Home },
  { path: '/admin-login', name: 'AdminLogin', component: AdminLogin },
  { path: '/user-login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'Register', component: Register },
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' }},
  { path: '/user-dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'user' }}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userRole = localStorage.getItem('userRole');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'HomeEnc' });
    } else {
      if (to.meta.role && to.meta.role !== userRole) {
        next({ name: 'HomeEnc' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
