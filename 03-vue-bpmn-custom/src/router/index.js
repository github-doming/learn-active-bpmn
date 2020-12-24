import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/basic'
  },
  {
    path: '/basic',
    component: () => import ('./../components/basic')
  },
  {
    path: '/custom-palette',
    component: () => import ('./../components/custom-palette')
  },  {
    path: '/custom-modeler',
    component: () => import ('./../components/custom-modeler')
  },  {
    path: '/custom-renderer',
    component: () => import ('./../components/custom-renderer')
  },
];

const router = new VueRouter({
  routes
});

export default router
