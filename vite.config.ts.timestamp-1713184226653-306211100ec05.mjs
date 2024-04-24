// vite.config.ts
import { defineConfig } from "file:///C:/Users/David/Dropbox/un/05CLOUD/DC/undp-access-all-data-repo/Access-All-Data-Viz/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/David/Dropbox/un/05CLOUD/DC/undp-access-all-data-repo/Access-All-Data-Viz/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslint from "file:///C:/Users/David/Dropbox/un/05CLOUD/DC/undp-access-all-data-repo/Access-All-Data-Viz/node_modules/vite-plugin-eslint/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), eslint()],
  build: {
    outDir: "build",
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    }
  },
  server: {
    cors: {
      origin: "*",
      methods: ["GET"],
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEYXZpZFxcXFxEcm9wYm94XFxcXHVuXFxcXDA1Q0xPVURcXFxcRENcXFxcdW5kcC1hY2Nlc3MtYWxsLWRhdGEtcmVwb1xcXFxBY2Nlc3MtQWxsLURhdGEtVml6XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEYXZpZFxcXFxEcm9wYm94XFxcXHVuXFxcXDA1Q0xPVURcXFxcRENcXFxcdW5kcC1hY2Nlc3MtYWxsLWRhdGEtcmVwb1xcXFxBY2Nlc3MtQWxsLURhdGEtVml6XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9EYXZpZC9Ecm9wYm94L3VuLzA1Q0xPVUQvREMvdW5kcC1hY2Nlc3MtYWxsLWRhdGEtcmVwby9BY2Nlc3MtQWxsLURhdGEtVml6L3ZpdGUuY29uZmlnLnRzXCI7LyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgZXNsaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBlc2xpbnQoKV0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2J1aWxkJyxcclxuICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tuYW1lXS5bZXh0XScsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBjb3JzOiB7XHJcbiAgICAgIG9yaWdpbjogJyonLFxyXG4gICAgICBtZXRob2RzOiBbJ0dFVCddLFxyXG4gICAgICBwcmVmbGlnaHRDb250aW51ZTogZmFsc2UsXHJcbiAgICAgIG9wdGlvbnNTdWNjZXNzU3RhdHVzOiAyMDQsXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUduQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQzNCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxNQUNKLFFBQVE7QUFBQSxNQUNSLFNBQVMsQ0FBQyxLQUFLO0FBQUEsTUFDZixtQkFBbUI7QUFBQSxNQUNuQixzQkFBc0I7QUFBQSxJQUN4QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
