import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
    readonly lblSidebar: Locator;
    readonly lblHeader: Locator;
    readonly lblWrapper: Locator;
    readonly btnProfileDropdown: Locator;
    readonly lnkLogout: Locator;

    constructor(page: Page) {
        super(page, '/admin/');
        this.lblSidebar = page.locator('#setup-menu-wrapper');
        this.lblHeader = page.locator('#header');
        this.lblWrapper = page.locator('#wrapper');
        this.btnProfileDropdown = page.locator('li.header-user-profile a.dropdown-toggle');
        this.lnkLogout = page.locator('li.header-logout a');
    }

    async clickLogout() {
        await test.step('Perform logout via UI', async () => {
            await test.step('Click User profile dropdown on selector "li.header-user-profile a.dropdown-toggle"', async () => {
                await this.clickElement(this.btnProfileDropdown);
            });
            await test.step('Click Logout link on selector "li.header-logout a"', async () => {
                await this.clickElement(this.lnkLogout);
            });
        });
    }

    async logoutViaUrl() {
        await test.step('Perform logout via URL redirection', async () => {
            await test.step('Navigate to logout endpoint "/admin/authentication/logout"', async () => {
                await this.page.goto('/admin/authentication/logout');
                await this.page.waitForLoadState('domcontentloaded');
            });
        });
    }
}
