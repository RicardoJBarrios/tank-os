/// <reference types='vitest' />
import { defineConfig, type PluginOption } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'node:path';
import { createVitestReporting } from './vitest-reporting';

const TEST_INCLUDE = [
  '{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
];
const COVERAGE_THRESHOLDS = {
  lines: 100,
  statements: 100,
  functions: 100,
  branches: 100,
};

export interface VitestConfigOptions {
  readonly projectName: string;
  readonly root: string;
  readonly workspacePathPrefix?: string;
  readonly angular?: boolean;
  readonly angularTsconfig?: string;
  readonly coverageInclude?: readonly string[];
  readonly staticCopy?: boolean;
  readonly aliases?: Readonly<Record<string, string>>;
  readonly dedupe?: readonly string[];
  readonly setupFiles?: string | false;
  readonly inlineAngularDependencies?: boolean;
}

/** Creates the workspace-standard browser Vitest/Vite configuration. */
export function createVitestConfig(options: VitestConfigOptions) {
  const workspacePathPrefix = options.workspacePathPrefix ?? '../../';
  const reporting = createVitestReporting(
    options.projectName,
    workspacePathPrefix,
  );

  return defineConfig(() => ({
    root: options.root,
    cacheDir: `${workspacePathPrefix}node_modules/.vite/${options.projectName}`,
    resolve: createResolveOptions(options),
    plugins: createPlugins(options),
    test: {
      name: options.projectName,
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: TEST_INCLUDE,
      ...(options.setupFiles === false
        ? {}
        : { setupFiles: [options.setupFiles ?? 'src/test-setup.ts'] }),
      reporters: ['default'],
      ...reporting,
      ...(options.inlineAngularDependencies
        ? {
            server: {
              deps: {
                inline: [
                  '@angular/core',
                  '@angular/common',
                  '@angular/compiler',
                  '@angular/forms',
                  '@angular/cdk',
                  '@angular/material',
                  '@angular/material-luxon-adapter',
                  '@angular/platform-browser',
                  '@angular/platform-browser-dynamic',
                  '@ngneat/spectator',
                ],
              },
            },
          }
        : {}),
      coverage: {
        ...reporting.coverage,
        ...(options.coverageInclude
          ? {
              include: options.coverageInclude.map((pattern) =>
                resolve(options.root, pattern),
              ),
              excludeAfterRemap: true,
            }
          : {}),
        reportsDirectory: `${workspacePathPrefix}coverage/${reportPath(options)}`,
        provider: 'v8' as const,
        thresholds: COVERAGE_THRESHOLDS,
      },
    },
  }));
}

function createPlugins(options: VitestConfigOptions): PluginOption[] {
  const plugins: PluginOption[] = [];
  const angularOptions = options.angularTsconfig
    ? { tsconfig: resolve(options.root, options.angularTsconfig) }
    : undefined;
  if (options.angular !== false) plugins.push(angular(angularOptions));
  if (options.staticCopy !== false)
    plugins.push(viteStaticCopy({ targets: [{ src: '*.md', dest: '.' }] }));
  return plugins;
}

function createResolveOptions(options: VitestConfigOptions) {
  return {
    tsconfigPaths: true,
    ...(options.dedupe ? { dedupe: [...options.dedupe] } : {}),
    ...(options.aliases
      ? {
          alias: Object.fromEntries(
            Object.entries(options.aliases).map(([name, path]) => [
              name,
              resolve(options.root, path),
            ]),
          ),
        }
      : {}),
  };
}

function reportPath(options: VitestConfigOptions): string {
  if (options.projectName.includes('/')) return options.projectName;
  const group = options.root.includes('/apps/') ? 'apps' : 'libs';
  return `${group}/${options.projectName}`;
}
