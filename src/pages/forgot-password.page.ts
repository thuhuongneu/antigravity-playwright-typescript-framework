import { Page, Locator, test } from '@playwright/test';
import { BasePage } from './base.page';

export class ForgotPasswordPage extends BasePage {
    readonly inputEmail: Locator;
    readonly btnConfirm: Locator;
    readonly lblHeading: Locator;
    readonly lblAlertSuccess: Locator;
    readonly lblAlertDanger: Locator;

    constructor(page: Page) {
        super(page, '/admin/authentication/forgot_password');
        this.inputEmail = page.locator('#email');
        this.btnConfirm = page.locator('button[type="submit"]');
        this.lblHeading = page.locator('h1');
        this.lblAlertSuccess = page.locator('div.alert.alert-success');
        this.lblAlertDanger = page.locator('div.alert.alert-danger');
    }

    async submitForgotPassword(email: string) {
        await test.step(`Submit Forgot Password for email: "${email}"`, async () => {
            if (email) {
                await test.step(`Enter email address: "${email}" into input "#email"`, async () => {
                    await this.fillText(this.inputEmail, email);
                });
            }
            await test.step('Click Submit button on selector "button[type=\'submit\']"', async () => {
                await this.clickElement(this.btnConfirm);
            });
        });
    }

    async getEmailValidationMessage(): Promise<string> {
        return await this.inputEmail.evaluate((el: HTMLInputElement) => el.validationMessage);
    }
}
