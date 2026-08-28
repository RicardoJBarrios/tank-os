import { expect, test, type Page } from '@playwright/test';

const aquariumsUrl = /\/aquariums$/u;
const loginUrl = /\/login$/u;
let aquariumSequence = 0;

test.describe('aquariums authorization', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    await resetAquariumsEmulator();
  });

  test('keeper can create, list and open its aquarium', async ({ page }) => {
    await loginAs(page);
    await expect(page.getByTestId('aquarium-list-status')).toContainText(
      'No aquariums yet.',
    );

    const name = uniqueAquariumName();
    await page.getByTestId('aquarium-create').click();
    await page.getByTestId('aquarium-name').fill(name);
    await page.getByTestId('aquarium-save').click();

    await expect(page).toHaveURL(aquariumsUrl);
    const item = page.getByTestId('aquarium-item').filter({ hasText: name });
    await expect(item).toBeVisible();
    await item.getByTestId('aquarium-detail').click();
    await expect(page.getByTestId('aquarium-detail-page')).toContainText(name);
  });

  test('keeper can edit and move its aquarium to the recycle bin', async ({
    page,
  }) => {
    const originalName = uniqueAquariumName();
    const updatedName = `${originalName} updated`;
    await loginAs(page);
    await createAquarium(page, originalName);

    const item = page
      .getByTestId('aquarium-item')
      .filter({ hasText: originalName });
    await item.getByTestId('aquarium-edit').click();
    await page.getByTestId('aquarium-name').fill(updatedName);
    await expect(page.getByTestId('aquarium-name')).toHaveValue(updatedName);
    await page.getByTestId('aquarium-save').click();
    await expect(page).toHaveURL(aquariumsUrl);
    await expect(
      page.getByTestId('aquarium-item').filter({ hasText: updatedName }),
    ).toBeVisible();

    await page
      .getByTestId('aquarium-item')
      .filter({ hasText: updatedName })
      .getByTestId('aquarium-delete')
      .click();
    await page.getByTestId('confirmation-confirm').click();
    await expect(
      page.getByTestId('aquarium-item').filter({ hasText: updatedName }),
    ).toHaveCount(0);
  });

  test('admin can see the keeper aquarium and create an aquarium', async ({
    page,
  }) => {
    const keeperAquarium = uniqueAquariumName();
    const adminAquarium = uniqueAquariumName();
    await loginAs(page);
    await createAquarium(page, keeperAquarium);
    await page.getByTestId('account-menu-trigger').click();
    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(loginUrl);

    await loginAs(page, 'admin@tankos.local', 'tankos-local-admin');
    await expect(
      page.getByTestId('aquarium-item').filter({ hasText: keeperAquarium }),
    ).toBeVisible();

    await page.getByTestId('aquarium-create').click();
    await page.getByTestId('aquarium-name').fill(adminAquarium);
    await page.getByTestId('aquarium-save').click();

    await expect(page).toHaveURL(aquariumsUrl);
    const adminItem = page
      .getByTestId('aquarium-item')
      .filter({ hasText: adminAquarium });
    await expect(adminItem).toBeVisible();
    await adminItem.getByTestId('aquarium-detail').click();
    await expect(page.getByTestId('aquarium-detail-page')).toContainText(
      adminAquarium,
    );
    await expect(page.locator('.tankos-feedback-error')).toHaveCount(0);
  });

  test('admin can restore and permanently delete an aquarium', async ({
    page,
  }) => {
    const name = uniqueAquariumName();
    await loginAs(page, 'admin@tankos.local', 'tankos-local-admin');
    await createAquarium(page, name);
    const item = page.getByTestId('aquarium-item').filter({ hasText: name });

    await item.getByTestId('aquarium-delete').click();
    await page.getByTestId('confirmation-confirm').click();
    await expect(item).toContainText('marked-for-deletion');
    await item.getByTestId('aquarium-restore').click();
    await expect(item).toContainText('active');

    await item.getByTestId('aquarium-delete').click();
    await page.getByTestId('confirmation-confirm').click();
    await item.getByTestId('aquarium-delete-permanently').click();
    await page.getByTestId('confirmation-confirm').click();
    await expect(
      page.getByTestId('aquarium-item').filter({ hasText: name }),
    ).toHaveCount(0);
  });
});

async function resetAquariumsEmulator(): Promise<void> {
  const response = await fetch(
    'http://127.0.0.1:8080/emulator/v1/projects/demo-tankos/databases/(default)/documents/aquariums',
    { method: 'DELETE' },
  );
  if (!response.ok) throw new Error('Unable to reset the aquariums emulator');
}

async function loginAs(
  page: Page,
  email = 'developer@tankos.local',
  password = 'tankos-local-dev',
): Promise<void> {
  await page.goto('/login?returnUrl=%2Faquariums');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL(aquariumsUrl);
}

async function createAquarium(page: Page, name: string): Promise<void> {
  await page.getByTestId('aquarium-create').click();
  await page.getByTestId('aquarium-name').fill(name);
  await page.getByTestId('aquarium-save').click();
  await expect(page).toHaveURL(aquariumsUrl);
  await expect(
    page.getByTestId('aquarium-item').filter({ hasText: name }),
  ).toBeVisible();
}

function uniqueAquariumName(): string {
  return `E2E Aquarium ${String(Date.now())}-${String(aquariumSequence++)}`;
}
