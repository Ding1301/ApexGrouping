<template>
  <div id="app">
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