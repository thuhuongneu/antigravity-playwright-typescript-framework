import { Page, Locator, expect, test } from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page, url: string = '') {
        this.page = page;
        this.url = url;
    }

    async navigate() {
        await test.step(`Navigate to page: "${this.url}"`, async () => {
            await this.page.goto(this.url);
            await this.page.waitForLoadState('domcontentloaded');
        });
    }

    async clickElement(locator: Locator) {
        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();
        await locator.click();
    }

    async fillText(locator: Locator, text: string) {
        await expect(locator).toBeVisible();
        await expect(locator).toBeEnabled();
        await locator.fill(text);
    }

    async getText(locator: Locator): Promise<string> {
        await expect(locator).toBeVisible();
        return await locator.innerText();
    }
}
