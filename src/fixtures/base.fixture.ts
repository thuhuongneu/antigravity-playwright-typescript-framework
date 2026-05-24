import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ForgotPasswordPage } from '../pages/forgot-password.page';
import { CustomersPage } from '../pages/customers.page';

type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    forgotPasswordPage: ForgotPasswordPage;
    customersPage: CustomersPage;
};

export const test = base.extend<MyFixtures & { screenshotOnPass: void }>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    forgotPasswordPage: async ({ page }, use) => {
        await use(new ForgotPasswordPage(page));
    },
    customersPage: async ({ page }, use) => {
        await use(new CustomersPage(page));
    },
    screenshotOnPass: [async ({ page }, use, testInfo) => {
        await use();
        if (testInfo.status === 'passed') {
            const screenshot = await page.screenshot();
            await testInfo.attach('final-screenshot-passed', {
                body: screenshot,
                contentType: 'image/png'
            });
        }
    }, { auto: true }],
});

export { expect } from '@playwright/test';
