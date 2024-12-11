/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EMAIL: string;
  readonly EMAIL_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
