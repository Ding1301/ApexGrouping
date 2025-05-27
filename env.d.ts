/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite 内置变量
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;

  // 应用配置
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  
  // API 配置
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: number;
  
  // 第三方服务
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  
  // 调试选项
  readonly VITE_APP_DEBUG: string; // 注意：实际为字符串 "true"/"false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}