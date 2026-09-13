import { resolve } from 'node:path';
import { defineConfig, mergeConfig, type UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createVitestConfig } from '../../tools/testing/vitest-config';

const testConfig = createVitestConfig({
  projectName: 'time-luxon',
  root: import.meta.dirname,
  angular: false,
  setupFiles: false,
});

const buildConfig = {
  build: {
    outDir: '../../dist/libs/time-luxon',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'time-luxon',
      fileName: 'index',
      formats: ['es'],
    },
    rolldownOptions: { external: ['@tankos/time', 'luxon'] },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
    viteStaticCopy({ targets: [{ src: 'package.json', dest: '.' }] }),
  ],
} satisfies UserConfig;

export default defineConfig((environment) => {
  const resolvedTestConfig =
    typeof testConfig === 'function' ? testConfig(environment) : testConfig;
  return mergeConfig(resolvedTestConfig, buildConfig);
});
