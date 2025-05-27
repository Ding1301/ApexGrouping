// router/index.js
// import { createRouter, createWebHistory } from 'vue-router';
// import homeView from '../views/homeView.vue';
// import groupingView from '../views/groupingView.vue'; // 确保文件名正确

// const router = createRouter({
//   history: createWebHistory(),
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component: homeView
//     },
//     {
//       path: '/grouping',
//       name: 'grouping',
//       component: groupingView
//     }
//   ]
// });

// export default router;

// src/router/index.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/homeView.vue'

import GroupingView from '@/views/groupingView.vue'


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/grouping',
    name: 'GroupingView',
    component: GroupingView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router