import { CartPage, TestType } from '@lk_pages/cart-page';
import { test } from '@playwright/test';
import { parsePrice } from '@utility/price-parser';

// I tried to make this test flexible. You can apply different promo codes for the different test cases (origin test,
// get passport test, full genome test) only by playing with the two variables below.

const promo = 'genotek5';
const testType: TestType = 'origin';

test.describe.configure({ mode: 'parallel', retries: 1 });

test(`Apply the "${promo}" promo code to the "${testType} test"`, async ({ page }) => {
  const cartPage = new CartPage();

  await test.step('Opening cart page', async () => {
    await cartPage.goto(page);
    await test.expect(page).toHaveURL(CartPage.URL_PATTERN);
  });

  await test.step('Choosing  test', async () => {
    await cartPage.clickTestType(testType, page);
    await test.expect(page.locator(CartPage.ORDER_REPORT_SELECTOR)).toBeVisible({ timeout: 10000 });
  });

  await test.step('Applying promo code', async () => {
    await page.waitForTimeout(1000); // Animation delay

    const priceBefore = parsePrice(await page.locator(CartPage.PRICE_SELECTOR).textContent());

    await page.locator(CartPage.PROMOCODE_LABEL_SELECTOR).click();
    await page.waitForSelector(CartPage.PROMOCODE_INPUT_SELECTOR, { state: 'visible' });

    await page.locator(CartPage.PROMOCODE_INPUT_SELECTOR).fill(promo);
    await page.locator(CartPage.PROMOCODE_INPUT_SELECTOR).press('Enter');

    await page.waitForSelector(CartPage.PROMOCODE_INPUT_SELECTOR, { state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(1000); // Animation delay

    const priceAfter = parsePrice(await page.locator(CartPage.PRICE_SELECTOR).textContent());

    test.expect(priceAfter).toBeLessThan(priceBefore);

    const promoState = page.locator(CartPage.PROMOCODE_STATE_SELECTOR).locator('span').getByText(/.*СКИДКА.*/i);
    const discountState = page.locator(CartPage.PROMOCODE_STATE_SELECTOR).locator('span').getByText(/.*Промокод.*/i);

    test.expect(promoState).toBeVisible();
    test.expect(discountState).toBeVisible();
  });

});
