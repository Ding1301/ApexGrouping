<template>
  <div id="app">
    <!-- 调试文本：若显示，说明应用已挂载 -->
    <router-view v-slot="{ Component }">
      <transition name="page-transition" mode="out-in">
        <component 
          :is="Component" 
          :key="$route.fullPath"
        />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const $route = useRoute(); // 获取当前路由信息
</script>

<style>
/* 过渡动画样式 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.page-transition-enter,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>