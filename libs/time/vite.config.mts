import { createVitestConfig } from '../../tools/testing/vitest-config';

export default createVitestConfig({
  projectName: 'time',
  root: __dirname,
  angularTsconfig: 'tsconfig.spec.json',
  // The independently covered runtime is a fixture, not Time production code.
  coverageInclude: ['src/**/*.ts'],
  inlineAngularDependencies: true,
  dedupe: [
    '@angular/core',
    '@angular/common',
    '@angular/forms',
    '@angular/cdk',
    '@angular/material',
  ],
});
