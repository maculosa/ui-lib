import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import vueJSX from "@vitejs/plugin-vue-jsx";
import Inspect from "vite-plugin-inspect";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VueRouterAutoImports } from "unplugin-vue-router";
import Markdown from "unplugin-vue-markdown/vite";
import VueRouter from "unplugin-vue-router/vite";
import { full as emoji } from "markdown-it-emoji";
import hljs from "highlight.js";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import markdownItTOC from "markdown-it-toc-done-right";
import uslug from "uslug";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import Layouts from "vite-plugin-vue-layouts-next";
import { markdownComponentImports } from "./build/plugins/markdown-component-imports";
import { searchIndex } from "./build/plugins/search-index";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    markdownComponentImports(),
    searchIndex(),
    vue({
      include: [/\.vue$/, /\.md$/], // <-- allows Vue to compile markdown files
    }),
    vueJSX(),
    tailwindcss(),
    Markdown({
      markdownItOptions: {
        html: true,
      },
      headEnabled: true,
      markdownItUses: [
        emoji,
        markdownItAttrs,
        [
          markdownItAnchor,
          {
            permalinkBefore: true,
            permalinkSymbol: "§",
            permalinkSpace: false,
            permalinkClass: "anchor",
            level: [1, 2, 3],
          },
        ],
        [
          markdownItTOC,
          {
            slugify: (s: any) => uslug(s),
          },
        ],
      ],
      markdownItSetup(md) {
        md.use(markdownItAnchor, {
          permalinkBefore: true,
          permalinkSymbol: "",
          permalinkAttrs: () => ({ "aria-hidden": true }),
        });
        md.renderer.rules.fence = (tokens, idx) => {
          const token = tokens[idx];
          const info = token.info.trim();
          if (info === "script-tabs") {
            const pkg = md.utils.escapeHtml(token.content.trim());
            return `<ScriptTabs pkg="${pkg}" />`;
          }
          const lang = info.split(/\s+/)[0] || "text";
          const langAlias = lang === "vue" ? "xml" : lang;
          const code = hljs.getLanguage(langAlias)
            ? hljs.highlight(token.content, {
                language: langAlias,
                ignoreIllegals: true,
              }).value
            : md.utils.escapeHtml(token.content);
          return `<div class="bm-codeblock"><div class="bm-codeblock-bar"><span>${md.utils.escapeHtml(
            lang
          )}</span></div><pre><code class="hljs">${code}</code></pre></div>`;
        };
      },
    }),
    VueRouter({
      extensions: [".vue", ".md"],
      importMode: "async",
      routesFolder: [
        { src: "src/pages" },
        { src: "src/docs", path: "docs/", extensions: [".md"] },
      ],
      dts: "types/typed-router.d.ts",
      exclude: [
        "**/__*",
        "**/__**/*",
        "**/*.component.vue",
        "**/examples/*.vue",
      ],
      logs: true,
      routeBlockLang: "yaml",
    }),
    Layouts({
      pagesDirs: ["src/docs", "src/pages"],
      extensions: ["vue", "md"],
      defaultLayout: "default",
      exclude: [
        "**/layouts/layout/**", // 排除layout子目录
        "**/layouts/logo/**", // 排除logo子目录
        "**/layouts/nav/**", // 排除nav子目录
        "**/layouts/sidebar/**", // 排除sidebar子目录
      ],
    }),
    Inspect(),
    Icons({
      compiler: "vue3",
      autoInstall: true,
      customCollections: {
        "bm-icon": FileSystemIconLoader("./src/assets/icons", (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/head",
        "@vueuse/core",
        VueRouterAutoImports,
        {
          // add any other imports you were relying on
          "vue-router/auto": ["useLink"],
        },
      ],
      dts: "types/auto-imports.d.ts",
    }),
    Components({
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver()],
      dts: "types/components.d.ts",
      extensions: ["vue", "md"],
    }),
  ],
  server: {
    host: true,
    port: 5300,
    warmup: {
      clientFiles: ["./index.html", "./src/**/*"],
    },
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          "vue-vendor": ["vue", "vue-router"],
          "naive-ui": ["naive-ui"],
          echarts: ["echarts", "vue-echarts"],
          "highlight": ["highlight.js", "@highlightjs/vue-plugin"],
        },
      },
    },
    // 压缩选项
    minify: "terser",
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
      },
    },
    // 启用 gzip 压缩
    reportCompressedSize: true,
    // CSS 代码分割
    cssCodeSplit: true,
    // 资源文件大小限制
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "naive-ui",
      "@vueuse/core",
      "highlight.js",
      "@highlightjs/vue-plugin",
    ],
    exclude: [],
  },
});
