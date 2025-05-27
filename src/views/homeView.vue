<template>
  <div class="home-page-box" :class="{ 'moving': isMoving }" @transitionend="handleTransitionEnd">
    <div class="video-container">
      <video 
        ref="videoRef" 
        :src="videoSrc" 
        autoplay 
        loop 
        :muted="isMuted" 
        class="video-element" 
        :style="{ objectPosition: objectPosition }"
      ></video>
    </div>
    <div class="play-box">
      <!-- 音量控制按钮 -->
      <div class="sound-box">
        <el-button class="sound-btn" @click="toggleSound">
          {{ isMuted ? '🔇' : '🔊' }}
        </el-button>
      </div>
      
      <div class="title-box">
        <h1>
          歪比巴卜_(:3」∠)_专属<br/>
          <span class="subtitle">Apex Legends</span>随机分组系统<br/>
          <span class="tagline">快速匹配·智能分组·开启竞技新纪元</span>
        </h1>
      </div>
      
      <div class="btn-box">
        <el-button size="large" type="success" round class="start-btn" @click="playBtn">开始随机分组</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import videoFile from '../assets/mp4/topMp4.mp4';

// 导入需要预加载的图片
import gallery from '@/assets/images/map/画廊.jpg';
import habitat from '@/assets/images/map/栖息地.jpg';
import partyCrasher from '@/assets/images/map/派对破坏者.jpg';
import overflow from '@/assets/images/map/溢出.jpg';
import phaseRunner from '@/assets/images/map/相位奔跑者.jpg';
import iconPt50 from '@/assets/images/icon-pt50.png';
import preview from '@/assets/images/bgm/preview.jpg';

const router = useRouter();
const videoRef = ref(null);
const videoSrc = ref(videoFile);
const isMuted = ref(true);
const isPlaying = ref(false);
const objectPosition = ref('center');
const isMoving = ref(false);
const jumpTo = ref(false);
const imagesLoaded = ref(false); // 图片加载状态

// 需要预加载的图片数组
const imagesToPreload = [
  gallery,
  habitat,
  partyCrasher,
  overflow,
  phaseRunner,
  iconPt50,
  preview
];

// 预加载图片函数
const preloadImages = () => {
  const promises = imagesToPreload.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  });
  
  // 等待所有图片加载完成或失败
  Promise.allSettled(promises).then(results => {
    const loaded = results.filter(r => r.status === 'fulfilled').length;
    // console.log(`成功预加载 ${loaded}/${imagesToPreload.length} 张图片`);
    imagesLoaded.value = true;
  }).catch(err => {
    console.error('图片预加载失败:', err);
    imagesLoaded.value = true; // 即使有失败，也继续
  });
};

// 视频控制
const toggleSound = () => {
  isMuted.value = !isMuted.value;
  videoRef.value.muted = isMuted.value;
};

const pauseVideo = () => {
  if (videoRef.value && isPlaying.value) {
    videoRef.value.pause();
  }
};

const playVideo = () => {
  if (videoRef.value && !isPlaying.value) {
    videoRef.value.play().catch(err => {
      console.error('播放失败:', err);
    });
  }
};

// 生命周期钩子
onMounted(() => {
  // 预加载图片
  preloadImages();
  
  if (videoRef.value) {
    videoRef.value.play().catch(err => {
      console.error('视频播放失败:', err);
    });
    videoRef.value.addEventListener('playing', () => {
      isPlaying.value = true;
    });
    videoRef.value.addEventListener('pause', () => {
      isPlaying.value = false;
    });
  }
});

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.removeEventListener('playing', () => {});
    videoRef.value.removeEventListener('pause', () => {});
  }
});

// 按钮点击事件：触发动画并跳转
const playBtn = () => {
  jumpTo.value = true;
  isMoving.value = true;
};

// 动画结束后跳转
const handleTransitionEnd = () => {
  if (jumpTo.value) {
    router.push('/grouping');
  }
};
</script>


<style scoped>
.home-page-box {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: transform 0.8s ease;
  z-index: 2;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-element {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: object-position 0.5s;
}

.sound-box{
  margin: 0 0 70px 0;
  padding: 0 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100px;
}

.sound-btn {
  z-index: 10;
  background-color: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.sound-btn:hover {
  background-color: rgba(0,0,0,0.7);
  transform: scale(1.1);
}

.play-button {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.9;
}

.play-button:hover {
  background-color: rgba(0,0,0,0.7);
  transform: translate(-50%, -50%) scale(1.1);
  opacity: 1;
}

.play-box{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.title-box {
  text-align: center;
  padding: 60px 20px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.title-box h1 {
  font-family: 'Montserrat', sans-serif; /* 无衬线字体，科技感 */
  font-size: 2.8rem;
  line-height: 1.1;
  color: #fff;
  text-transform: uppercase; /* 英文大写 */
  position: relative;
  z-index: 2;
}

.title-box h1 span:first-child {
  color: #ff4500; /* 橙红色强调 */
  font-style: normal;
}

/* 副标题样式（Apex Legends） */
.subtitle {
  font-size: 1.8rem;
  color: #55f; /* 电光紫 */
  display: block;
  margin: 10px 0;
  letter-spacing: 4px;
  text-shadow: 0 0 15px rgba(85, 0, 255, 0.6); /* 霓虹光效 */
}

/* 标语样式 */
.tagline {
  font-size: 1.2rem;
  color: #3a86ff; /* 深蓝紫色 */
  letter-spacing: 3px;
  opacity: 0.9;
  margin-top: 15px;
  text-shadow: 
    0 0 5px rgba(58, 134, 255, 0.5), /* 内层半透明光晕 */
    0 0 10px rgba(58, 134, 255, 0.8), /* 中层光晕 */
    0 0 15px rgba(58, 134, 255, 0.3); /* 外层扩散光晕 */
}

/* 动态光效动画 */
.title-box h1 {
  animation: neon-glow 2s infinite alternate;
}

@keyframes neon-glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #55f, 0 0 30px #0ff;
  }
  to {
    text-shadow: 0 0 15px #fff, 0 0 25px #ff4500, 0 0 40px #ffd700;
  }
}

.btn-box{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.el-button--large.is-round{
    width: 200px;
    height: 50px;
    font-size: 18px;
    padding: 20px;
}

/* 点击向上移动 */
.moving{
  transform: translateY(-100vh);
}

.grouping-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.6) translateZ(-200px); /* 初始状态：缩小并后移 */
  transform-origin: center;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); /* 使用更自然的贝塞尔曲线 */
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #fff;
  opacity: 0.7; /* 初始半透明 */
  perspective: 1000px; /* 添加透视效果 */
}

.amplify {
  transform: translate(-50%, -50%) scale(1) translateZ(0); /* 最终状态：放大并前移 */
  opacity: 1; /* 完全不透明 */
}

.fakeBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.6) translateZ(-200px); /* 初始状态：缩小并后移 */
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #fff;
  opacity: 0.7; /* 初始半透明 */
  perspective: 1000px; /* 添加透视效果 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home-page-box {
    height: 100vh;
  }

  .title-box h1 {
    font-size: 1.8rem; /* 减小标题字体大小 */
    line-height: 1.3;
  }

  .subtitle {
    font-size: 1.2rem; /* 减小副标题字体大小 */
    letter-spacing: 2px;
    margin: 8px 0;
  }

  .tagline {
    font-size: 0.9rem; /* 减小标语字体大小 */
    letter-spacing: 2px;
    margin-top: 10px;
  }

  .play-button {
    width: 60px; /* 减小播放按钮尺寸 */
    height: 60px;
    font-size: 24px;
  }

  .sound-box {
    margin: 0 0 30px 0; /* 调整声音按钮位置 */
    padding: 0 15px;
    height: 80px;
  }

  .sound-btn {
    width: 40px; /* 减小声音按钮尺寸 */
    height: 40px;
    font-size: 20px;
  }

  .el-button--large.is-round {
    width: 160px; /* 减小按钮尺寸 */
    height: 45px;
    font-size: 16px;
    padding: 15px;
  }

  /* 调整分组页面的初始状态 */
  .grouping-box {
    transform: translate(-50%, -50%) scale(0.9) translateZ(-100px); /* 初始放大一点 */
  }

  /* 优化视频容器 */
  .video-container {
    height: 100vh;
  }

  /* 优化按钮容器 */
  .btn-box {
    margin-top: 20px;
  }
}

/* 针对超小屏幕的进一步优化 */
@media (max-width: 480px) {
  .title-box {
    padding: 40px 15px; /* 减小内边距 */
  }

  .title-box h1 {
    font-size: 1.5rem; /* 进一步减小标题字体 */
  }

  .subtitle {
    font-size: 1rem; /* 进一步减小副标题字体 */
    letter-spacing: 1px;
  }

  .tagline {
    font-size: 0.8rem; /* 进一步减小标语字体 */
    letter-spacing: 1px;
  }

  .play-button {
    width: 50px; /* 进一步减小播放按钮 */
    height: 50px;
    font-size: 20px;
  }

  .sound-box {
    margin: 0 0 20px 0;
    height: 60px;
  }

  .sound-btn {
    width: 35px; /* 进一步减小声音按钮 */
    height: 35px;
    font-size: 18px;
  }

  .el-button--large.is-round {
    width: 140px; /* 进一步减小按钮尺寸 */
    height: 40px;
    font-size: 14px;
    padding: 12px;
  }

  /* 微调分组页面动画 */
  .grouping-box {
    transform: translate(-50%, -50%) scale(0.95) translateZ(-50px);
  }
}

</style>