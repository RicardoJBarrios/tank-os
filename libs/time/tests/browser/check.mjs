import { createServer } from 'vite';
import { chromium, expect } from '@playwright/test';
import { resolve } from 'node:path';

const workspace = resolve(import.meta.dirname, '../../../..');
const server = await createServer({
  configFile: false,
  root: import.meta.dirname,
  resolve: {
    alias: [
      {
        find: '@angular/material/prebuilt-themes/azure-blue.css',
        replacement: resolve(
          workspace,
          'node_modules/@angular/material/prebuilt-themes/azure-blue.css',
        ),
      },
      {
        find: '@tankos/time/angular',
        replacement: resolve(
          workspace,
          'dist/libs/time/esm2022/angular/tankos-time-angular.js',
        ),
      },
      {
        find: '@tankos/time-luxon',
        replacement: resolve(workspace, 'dist/libs/time-luxon/index.js'),
      },
      {
        find: '@tankos/time',
        replacement: resolve(
          workspace,
          'dist/libs/time/esm2022/tankos-time.js',
        ),
      },
    ],
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/material',
      '@angular/cdk',
    ],
  },
  server: { host: '127.0.0.1', port: 0, fs: { allow: [workspace] } },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(server.resolvedUrls.local[0]);
  const date = page.locator('#start-date');
  await expect(date).toBeVisible();
  await page.getByRole('button', { name: 'Validar', exact: true }).click();
  await expect(page.locator('mat-error').first()).toBeVisible();
  await date.fill('03/04/2026');
  await date.press('Tab');
  await expect(page.locator('#date-value')).toContainText('"month": 4');
  await expect(page.locator('#formatted')).toHaveText(
    'viernes, 3 de abril de 2026',
  );
  const edits = await page.locator('#edits').textContent();
  await page.getByRole('button', { name: 'English formats' }).click();
  await expect(date).toHaveValue('4/3/2026');
  await expect(page.locator('#edits')).toHaveText(edits);
  await expect(page.locator('#formatted')).toHaveText('Friday, April 3, 2026');
  await date.focus();
  await date.press('Alt+ArrowDown');
  await expect(page.locator('mat-calendar')).toBeVisible();
  await expect(page.locator('mat-calendar :focus')).toHaveCount(1);
  // Material ignores close requests while its opening animation is running.
  await expect(page.locator('.mat-datepicker-content-animating')).toHaveCount(
    0,
  );
  await expect(
    page.locator('mat-calendar button').filter({ hasText: /^\s*2\s*$/u }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('mat-calendar')).toHaveCount(0);
  await expect(date).toBeFocused();
  const clock = page.locator('#clock-clock');
  await clock.fill('1:30 PM');
  await clock.press('Tab');
  await expect(page.locator('#clock-value')).toContainText('"hour": 13');
  await expect(clock).toHaveAccessibleName('Hora de alimentación');
  await expect(date).toHaveAccessibleName('Inicio');
  const instantEdits = await page.locator('#instant-edits').textContent();
  await page.getByRole('button', { name: 'Cambiar zona' }).click();
  await expect(page.locator('#instant-clock')).toHaveValue(/5:30\sAM/u);
  await expect(page.locator('#instant-edits')).toHaveText(instantEdits);
  await expect(page.locator('#instant-value')).toContainText(
    '"epochMilliseconds": 0',
  );
  expect(errors).toEqual([]);
  console.log(
    'Time browser contract passed: regional input, reactive pipes, no locale edits, submit errors, bounds, keyboard/focus, Signal Forms and labels.',
  );
} finally {
  await browser?.close();
  await server.close();
}
