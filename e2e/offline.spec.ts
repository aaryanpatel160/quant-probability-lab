import { expect, test } from '@playwright/test'

test('loads curriculum and relaunches offline', async ({ page, context, browserName }) => {
  await page.goto('/')
  await expect(page.getByText('Make uncertainty')).toBeVisible()
  await page.waitForFunction(() => navigator.serviceWorker?.ready)
  if (browserName === 'webkit') {
    await page.getByText('Learn').last().click()
    await expect(page.getByText('Zero to hard')).toBeVisible()
    return
  }
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByText('Continue learning')).toBeVisible()
  await page.getByText('Learn').last().click()
  await expect(page.getByText('Zero to hard')).toBeVisible()
})
