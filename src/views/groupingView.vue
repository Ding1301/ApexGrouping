<template>
  <div class="grouping-box" :class="{ 'amplify': isAmplify }" @animationend="onAnimationEnd">
    <div class="grouping-content">
      <div class="groupingBox">
        <div class="groupingTitle">
          竞技场地图展示
        </div>
        <div class="grouping-img">
          <el-carousel :interval="4000" type="card" autoplay indicator-position="none" arrow="never" :pause-on-hover="false" >
            <el-carousel-item v-for="item in mapData" :key="item">
              <el-image :src="item.url" fit="cover" style="width: 100%; height: 100%;" lazy />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="groupingBox">
        <div class="groupingTitle">
          随机分组-随机地图
        </div>
        <div class="staffBox">
          <div class="formBox">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="战斗场数：" label-width="120px"  placeholder="session">
                <el-input v-model="formInline.session" clearable placeholder="请输入战斗场数：" />
              </el-form-item>
              <el-form-item label="观战人数：" label-width="120px" placeholder="watch">
                <el-input v-model="formInline.watch" clearable placeholder="请输入观战人数" />
              </el-form-item>
              <el-form-item label="战斗人员名单" label-width="120px" placeholder="nameList">
                <el-input v-model="formInline.nameList" style="width: 192px" autosize type="textarea" placeholder="请输入名单,以;分隔"/>
              </el-form-item>
            </el-form>
            <span>
              <el-button type="success" round size="large" @click="submission">开始匹配</el-button>
            </span>
          </div>
        </div>
      </div>
      <div v-if="groupedTeams.length" class="result-container">
        <h3 class="groupingTitle">分组结果</h3>
        <el-row class="groupingRow" v-for="(item, rowIndex) in Math.ceil(groupedTeams.length / 2)" :key="rowIndex">
          <el-col :span="8" class="groupingCol">
            <span class="groupAsty">
              A小组
            </span>
            <div class="groupingColDiv" v-for="(item1,rowIndex1) in groupedTeams[rowIndex * 2]" :key="rowIndex1">
              {{ item1 }}
            </div>
          </el-col>
          <el-col :span="8" class="groupingCol">
            <div style="display: flex; flex-direction: column; align-items: center; font-size: 25px; font-weight: 700;">
              <div v-if="unusedMembers && unusedMembers.length > 0">
                <p style="margin-bottom: 20px;">
                  观战人员: {{ unusedMembers.join('、') }}
                </p>
              </div>
              <el-image :src="iconPt50Image" style="width: 200px; height: 200px;" />
            </div>
          </el-col>
          <el-col :span="8" class="groupingCol">
            <span class="groupBsty">
              B小组
            </span>
            <div class="groupingColDiv" v-for="(item2,rowIndex2) in groupedTeams[rowIndex * 2 + 1] || []" :key="rowIndex2">
              {{ item2 }}
            </div>
          </el-col>
          <div class="groupImg">
            <h3>比赛地图</h3>
           <el-image style="width: 100%; height: 100%" :src="mapData[(rowIndex + 1) % mapData.length].url" fit="cover" />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue'
import gallery from '@/assets/images/map/画廊.jpg';
import habitat from '@/assets/images/map/栖息地.jpg';
import partyCrasher from '@/assets/images/map/派对破坏者.jpg';
import overflow from '@/assets/images/map/溢出.jpg';
import phaseRunner from '@/assets/images/map/相位奔跑者.jpg';
import iconPt50 from '@/assets/images/icon-pt50.png';



const router = useRouter();
const isAmplify = ref(false); // 控制放大动画
const mapData = ref([
  { id: 0, url: gallery },
  { id: 1, url: habitat },
  { id: 2, url: partyCrasher },
  { id: 3, url: overflow },
  { id: 4, url: phaseRunner },
]);

const iconPt50Image = ref(iconPt50)

const usedIndices = ref([]); 

// 当前选中的地图索引
const currentMapIndex = ref(0); 

const formInline = reactive({
  // 战斗场次
  session: '',
  // 观战人数
  watch: '',
  // 参战名单
  nameList: []
})

// 未参赛名单
const unusedMembersPerSession = ref([])

// 观战人数
const unusedMembers = ref([]);

const groupedTeams = ref([]);

// 生命周期钩子
onMounted(() => {
  // 延迟触发动画，确保组件已渲染
  setTimeout(() => {
    isAmplify.value = true;
  }, 10);
});

// 动画结束回调
const onAnimationEnd = (event) => {
  // 可以添加额外的动画结束逻辑
};

// 随机地图
const selectNextRandomMap = () => {
  if (usedIndices.value.length === mapData.value.length) {
    // 若所有地图都已使用过，重置已用索引列表
    usedIndices.value = []; 
  }
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * mapData.value.length);
  } while (usedIndices.value.includes(newIndex));
  usedIndices.value.push(newIndex);
  currentMapIndex.value = newIndex;

  console.log(currentMap.value,'currentMap')
};

// 获取当前选中的地图
const currentMap = computed(() => {
  return mapData.value[currentMapIndex.value];
});

// 随机分组
const submission = () => {
  // 1. 分割并清理名字列表
  const namesArray = formInline.nameList
    .split(/[;；]/)
    .map(name => name.trim())
    .filter(name => name);

  // 2. 获取场次数量
  const sessionCount = parseInt(formInline.session) || 1;
  
  // 3. 为每个场次创建独立的分组
  const allSessions = [];
  
  for (let s = 0; s < sessionCount; s++) {
    // 每场都重新打乱数组，生成新的随机顺序
    const shuffledNames = [...namesArray];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }
    
    // 固定每局6人参与，剩下的作为未参与成员
    const participants = shuffledNames.slice(0, 6);
    const currentUnused = shuffledNames.slice(6);
    
    // 处理本场次的分组（每组固定3人）
    const sessionGroups = [];
    const memberCount = participants.length;
    const groupCount = Math.ceil(memberCount / 3); // 计算总组数
    
    for (let i = 0; i < groupCount; i++) {
      const start = i * 3;
      const groupMembers = participants.slice(start, start + 3);
      
      // 为每个成员添加序号（本场次内的序号）
      const numberedGroup = groupMembers.map((name, index) => {
        const position = start + index + 1; // 全局序号（从1开始）
        return `第${position}位: ${name}`;
      });
      
      sessionGroups.push(numberedGroup);
    }
    
    // 将本场次的所有分组和未参与成员添加到结果中
    allSessions.push({
      sessionNumber: s + 1,
      groups: sessionGroups,
      unusedMembers: currentUnused
    });
    
    // 更新当前局未参与成员（只保留当前循环的未参与成员）
    if (s === sessionCount - 1) { // 只在最后一次循环更新
      unusedMembers.value = currentUnused;
    }
  }

  // 将所有场次的分组展平为一维数组
  groupedTeams.value = allSessions.flatMap(session => session.groups);
  
  // 存储每局未参与成员信息（可选，根据需要保留）
  unusedMembersPerSession.value = allSessions.map(session => ({
    sessionNumber: session.sessionNumber,
    members: session.unusedMembers
  }));

  for (let i = 1; i <= formInline.session; i++) {
    selectNextRandomMap();
  }
};
</script>

<style scoped>
html {
  position: relative;
  min-height: 100%;
}

body {
  margin: 0;
  padding: 0;
}

.grouping-box {
  position: absolute;
  inset: 0;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, transform 0.5s ease, visibility 0.5s ease;
  transform: scale(0.5); /* 初始状态缩小为 80% */
  transform-origin: center center; /* 从中心开始缩放 */
}

.grouping-box::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('../assets/images/bgm/preview.jpg');
  background-repeat: repeat;
  background-size: auto;
  background-position: 0 0;
  z-index: -1;
}

.grouping-box::after {
  content: '';
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: -1;
}

.amplify {
  opacity: 1;
  visibility: visible;
  overflow: auto;
  transform: scale(1); /* 放大到原始大小（全屏） */
}

/* 内容容器 */
.grouping-content {
  width: 100%;
  max-width: 100%; /* 设置最大宽度 */
  box-sizing: border-box;
  margin: 0 auto; /* 水平居中 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.groupingBox{
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.groupingTitle {
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.5rem); /* 响应式字体大小 */
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  /* 渐变文字效果 */
  background: linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  background-size: 300% 300%;
  animation: gradientMove 8s ease infinite;
  
  /* 底部装饰线 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #3B82F6, #8B5CF6);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  /* 悬停效果 */
  &:hover::after {
    transform: scaleX(1);
  }
}

/* 渐变动画 */
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.grouping-img{
  width: 80%;
  height: 300px;
  display: flex;
  justify-content: space-between;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel--horizontal, .el-carousel--vertical{
  width: 100%;
}

.staffBox{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.formBox{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 100%;
  margin: 100px 0;
}

.groupingRow {
  margin-top: 50px;
  width: 100%;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.08),
    0 15px 35px -10px rgba(0, 0, 0, 0.1);
}

.groupingCol{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.groupAsty{
  font-size: 25px;
  font-weight: 700;
  color: #d0021b;
  margin-bottom: 20px;
}

.groupBsty{
  font-size: 25px;
  font-weight: 700;
  color: #114bf0;
  margin-bottom: 20px;
}
.groupingColDiv {
  font-size: 18px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.groupingColDiv:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.groupingColDiv::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: #3B82F6;
}

.group-card ul {
  list-style: none;
}

.groupImg {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 25px auto;
  width: 75%;
  height: 400px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.groupImg:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.groupImg h3 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  z-index: 10;
  border-radius: 10px 10px 0 0;
  backdrop-filter: blur(5px);
}

.groupImg .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.groupImg:hover .el-image {
  transform: scale(1.03);
}

::v-deep .el-form-item__label {
  color: #000;
}


/* 移动端适配 */
@media (max-width: 768px) {
  .grouping-box {
    padding: 20px;
  }
  
  .groupingBox,
  .result-container,
  .groupImg {
    width: 100%;
  }
  
  .grouping-img {
    width: 100%;
    height: 200px; /* 减小图片高度 */
  }
  
  .groupingTitle {
    font-size: clamp(1.2rem, 5vw, 1.8rem); /* 响应式字体大小 */
    margin-bottom: 20px;
  }
  
  .groupingRow {
    padding: 16px;
    margin-top: 30px;
  }
  
  .groupAsty, .groupBsty {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .groupingColDiv {
    font-size: 16px;
    padding: 12px;
    margin-bottom: 10px;
  }
  
  .groupImg {
    height: 250px; /* 减小图片高度 */
    margin: 20px auto;
  }
  
  /* 轮播图适配 */
  .el-carousel__item {
    height: 200px !important; /* 强制设置高度 */
  }
  
  /* 表单适配 */
  .formBox {
    width: 100%;
  }
  
  /* 隐藏一些在移动端不必要的装饰元素 */
  .groupingTitle::after {
    display: none;
  }
}

/* 针对更小屏幕的额外调整 */
@media (max-width: 480px) {
  .grouping-img {
    height: 150px;
  }
  
  .groupImg {
    height: 200px;
  }
  
  .groupImg h3 {
    font-size: 1rem;
    padding: 8px 12px;
  }
  
  /* 调整渐变背景，避免重复加载大图 */
  .grouping-box::before {
    background-size: contain;
    background-position: top;
  }
  
  /* 调整遮罩层透明度 */
  .grouping-box::after {
    background-color: rgba(255, 255, 255, 0.75);
  }
}
</style>
