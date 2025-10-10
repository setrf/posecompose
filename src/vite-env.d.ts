/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOG_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
