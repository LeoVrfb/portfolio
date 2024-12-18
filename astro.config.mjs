import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import autoprefixer from "autoprefixer";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react(), tailwind(), mdx()],
  vite: {
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "defaults",
              "not IE 11",
              "maintained node versions",
              "safari >= 7",
              "last 2 versions",
              "> 1%",
            ],
          }),
        ],
      },
    },
  },
});
