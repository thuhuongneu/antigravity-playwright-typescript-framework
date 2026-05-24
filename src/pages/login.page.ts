import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';
import { ForgotPasswordPage } from './forgot-password.page';

export class LoginPage extends BasePage {
    readonly inputEmail: Locator;
    readonly inputPassword: Locator;
    readonly chkRememberMe: Locator;
    readonly btnLogin: Locator;
    readonly lblAlertDanger: Locator;
    readonly lblAlertSuccess: Locator;
    readonly lnkForgotPassword: Locator;
    readonly lblHeading: Locator;
    readonly lblRememberMeLabel: Locator;
    readonly divRememberMeWrapper: Locator;

    constructor(page: Page) {
        super(page, '/admin/authentication');
        this.inputEmail = page.locator('#email');
        this.inputPassword = page.locator('#password');
        this.chkRememberMe = page.locator('#remember');
        this.btnLogin = page.locator('button[type="submit"]');
        this.lblAlertDanger = page.locator('div.alert.alert-danger');
        this.lblAlertSuccess = page.locator('div.alert.alert-success');
        this.lnkForgotPassword = page.locator('a[href*="forgot_password"]');
        this.lblHeading = page.locator('h1');
        this.lblRememberMeLabel = page.locator('label[for="remember"]');
        this.divRememberMeWrapper = page.locator('div.checkbox');
    }

    async login(email: string, password: string) {
        await test.step(`Login to CRM with email: "${email}"`, async () => {
            await test.step(`Enter email address: "${email}" into input "#email"`, async () => {
                await this.fillText(this.inputEmail, email);
            });
            await test.step('Enter password: "••••••••" into input "#password"', async () => {
                await this.fillText(this.inputPassword, password);
            });
            await test.step('Click Login button on selector "button[type=\'submit\']"', async () => {
                await this.clickElement(this.btnLogin);
            });
        });
    }

    async clickForgotPassword(): Promise<ForgotPasswordPage> {
        return await test.step('Navigate to Forgot Password page', async () => {
            await test.step('Click Forgot Password link on selector "a[href*=\'forgot_password\']"', async () => {
                await this.clickElement(this.lnkForgotPassword);
            });
            return new ForgotPasswordPage(this.page);
        });
    }

    async getEmailValidationMessage(): Promise<string> {
        return await this.inputEmail.evaluate((el: HTMLInputElement) => el.validationMessage);
    }
}
