<!-- components/SpeechInput.vue -->
<template>
  <div class="speech-input-container">
    <div class="input-wrapper">
      <el-input
        v-model="inputText"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请输入或按住按钮说话（以分号分隔）"
        @input="handleInput"
        :disabled="isListening"
        class="input-box"
      />
      
      <div class="speech-btn" 
           @touchstart="startListening" 
           @touchend="stopListening"
           @mousedown="startListening" 
           @mouseup="stopListening"
           @mouseleave="stopListening"
           :class="{ active: isListening }">
        <i class="el-icon-microphone" />
        <span>{{ isListening ? '正在识别...' : '按住 说话' }}</span>
      </div>
    </div>
    
    <el-button
      icon="el-icon-circle-close"
      @click="clearInput"
      v-if="inputText"
      class="clear-btn"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue']);
const inputText = ref(props.modelValue);
const isListening = ref(false);
const recognition = ref(null);
const isMobile = ref(false);

// 检测设备类型
onMounted(() => {
  isMobile.value = /Mobile|Android|iOS/i.test(navigator.userAgent);
  initSpeechRecognition();
});

const initSpeechRecognition = () => {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    console.log('当前设备不支持语音识别');
    return;
  }

  recognition.value = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.value.lang = 'zh-CN';
  recognition.value.continuous = false; // 改为非连续模式，按需识别
  recognition.value.interimResults = true;

  recognition.value.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('')
      .trim();
    
    // 格式化语音内容，自动添加分号
    const formattedText = transcript
      .replace(/(和|与|、|,|\s+)/g, '; ')
      .replace(/;+/g, ';')
      .trim();
    
    // 将语音内容追加到现有内容后面（保留手动输入）
    inputText.value = inputText.value ? 
      `${inputText.value.trim()}; ${formattedText}` : 
      formattedText;
      
    emit('update:modelValue', inputText.value);
  };

  recognition.value.onerror = (error) => {
    console.error('语音识别错误:', error);
    isListening.value = false;
  };

  recognition.value.onend = () => {
    isListening.value = false;
  };
};

const startListening = () => {
  if (!recognition.value) return;
  
  isListening.value = true;
  recognition.value.start();
};

const stopListening = () => {
  if (!recognition.value || !isListening.value) return;
  
  recognition.value.stop();
  isListening.value = false;
  
  // 确保以分号结尾
  if (inputText.value && !inputText.value.endsWith(';')) {
    inputText.value += ';';
    emit('update:modelValue', inputText.value);
  }
};

const handleInput = (e) => {
  emit('update:modelValue', e.target.value);
};

const clearInput = () => {
  inputText.value = '';
  emit('update:modelValue', '');
};

onUnmounted(() => {
  if (recognition.value) {
    recognition.value.stop();
  }
});
</script>

<style scoped>
.speech-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 600px;
}

.input-wrapper {
  position: relative;
}

.input-box {
  padding-right: 50px; /* 为语音按钮腾出空间 */
}

.speech-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 40px;
  height: 40px;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.speech-btn.active {
  background-color: #ff4d4f;
  transform: scale(1.1);
}

.speech-btn span {
  display: none;
  margin-left: 5px;
}

/* 宽屏显示文字提示 */
@media (min-width: 768px) {
  .speech-btn {
    width: auto;
    padding: 0 15px;
    border-radius: 20px;
  }
  
  .speech-btn span {
    display: inline-block;
  }
}

.clear-btn {
  align-self: flex-end;
  margin-top: 5px;
}
</style>