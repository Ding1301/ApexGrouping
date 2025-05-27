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
    name: 'Home',
    component: HomeView
  },
  {
    path: '/grouping',
    name: 'Grouping',
    component: GroupingView
  }
]

// 指定 base 参数
const router = createRouter({
  history: createWebHashHistory('/ApexGrouping/'),
  routes
})

export default router