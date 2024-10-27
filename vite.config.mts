import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            input: "src/module.ts",
            output: {
                entryFileNames: "scripts/module.js",
                dir: "vrt",
                format: "es",
            },
        },
    },
    plugins: [
        copy({
            targets: [{ src: "src/module.json", dest: "vrt" }],
            hook: "writeBundle",
        }),
        copy({
            targets: [{ src: "src/lang", dest: "vrt" }],
            hook: "writeBundle",
        }),
        copy({
            targets: [{ src: "src/templates", dest: "vrt" }],
            hook: "writeBundle",
        }),
    ],
});