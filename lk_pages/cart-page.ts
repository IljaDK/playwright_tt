import { Page } from '@playwright/test';

export type TestType = 'origin' | 'gen_passport' | 'full_genome';

export class CartPage {
    public static readonly URL_PATTERN = /.*basket.genotek\.ru\/?/;
    public static readonly ORDER_REPORT_SELECTOR = '.basket-order';
    public static readonly PRICE_SELECTOR = CartPage.ORDER_REPORT_SELECTOR + ' .basket-order__report-total priceroller';
    public static readonly PROMOCODE_STATE_SELECTOR = CartPage.ORDER_REPORT_SELECTOR + ' .basket-order__report-info';
    public static readonly PROMOCODE_LABEL_SELECTOR = CartPage.ORDER_REPORT_SELECTOR + ' .basket-promo-code__label';
    public static readonly PROMOCODE_INPUT_SELECTOR = CartPage.ORDER_REPORT_SELECTOR + ' input.basket-promo-code__input';

    async clickTestType(type: TestType, page: Page) {
        let index = 0;

        if (type === 'origin') index = 1;
        else if (type === 'gen_passport') index = 2;
        else if (type === 'full_genome') index = 3;

        if (index === 0) throw new Error('Unsupported test type');

        // I don't think searching by text is a good idea, as the text might change in diffetent languages,
        // but it will do for now, I guess
        await page
            .locator(`.swiper-wrapper .swiper-slide:nth-child(${index}) a.app-button`)
            .getByText('Добавить в корзину') 
            .click();
    }

    async goto(page: Page) {
        await page.goto('https://basket.genotek.ru');
    }
}
