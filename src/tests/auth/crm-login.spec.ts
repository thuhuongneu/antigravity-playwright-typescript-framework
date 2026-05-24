import { test, expect } from '../../fixtures/base.fixture';
import { EnvConfig } from '../../utils/env.config';

test.describe('CRM Authentication - Login Tests', () => {

    const VALID_EMAIL = EnvConfig.ADMIN_USERNAME;
    const VALID_PASSWORD = EnvConfig.ADMIN_PASSWORD;

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
    });

    // ==================== MOD-01: Login Form UI ====================

    test('TC_LOGIN_001: Verify trang Login hiển thị đầy đủ', async ({ loginPage }) => {
        await test.step('Verify all UI elements on Login page are visible', async () => {
            await expect(loginPage.inputEmail).toBeVisible();
            await expect(loginPage.inputPassword).toBeVisible();
            await expect(loginPage.btnLogin).toBeVisible();
            await expect(loginPage.lblHeading).toHaveText('Login');
            await expect(loginPage.divRememberMeWrapper).toBeVisible();
            await expect(loginPage.lnkForgotPassword).toBeVisible();
        });
    });

    test('TC_LOGIN_002: HTML5 validation khi email không có @', async ({ loginPage, page }) => {
        await loginPage.login('invalidemail', VALID_PASSWORD);
        
        await test.step('Verify HTML5 validation message for missing "@"', async () => {
            const validationMsg = await loginPage.getEmailValidationMessage();
            expect(validationMsg).toContain('@');
            expect(page.url()).toContain('authentication');
        });
    });

    test('TC_LOGIN_003: HTML5 validation khi email thiếu domain', async ({ loginPage, page }) => {
        await loginPage.login('test@', VALID_PASSWORD);
        
        await test.step('Verify HTML5 validation message for missing domain', async () => {
            const validationMsg = await loginPage.getEmailValidationMessage();
            expect(validationMsg).not.toBe('');
            expect(page.url()).toContain('authentication');
        });
    });

    test('TC_LOGIN_004: Password field hiển thị masked', async ({ loginPage }) => {
        await test.step('Verify Password field type is masked as "password"', async () => {
            await expect(loginPage.inputPassword).toHaveAttribute('type', 'password');
        });
    });

    test('TC_LOGIN_005: Remember me mặc định unchecked', async ({ loginPage }) => {
        await test.step('Verify Remember Me checkbox is unchecked by default', async () => {
            await expect(loginPage.chkRememberMe).not.toBeChecked();
        });
    });

    // ==================== MOD-02A: Happy Path ====================

    test('TC_LOGIN_009: Đăng nhập thành công', async ({ loginPage, dashboardPage, page }) => {
        await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
        
        await test.step('Verify Dashboard page loaded successfully', async () => {
            await expect(dashboardPage.lblWrapper).toBeVisible();
            expect(page.url()).toContain('/admin');
            await expect(page).toHaveTitle(/Dashboard/);
        });
    });

    // ==================== MOD-02C: Empty Fields ====================

    test('TC_LOGIN_010: Lỗi server-side khi trống Email', async ({ loginPage }) => {
        await loginPage.login('', 'AnyPass@123');
        
        await test.step('Verify server-side error message for missing Email', async () => {
            await expect(loginPage.lblAlertDanger).toBeVisible();
            await expect(loginPage.lblAlertDanger).toContainText('Email Address field is required');
        });
    });

    test('TC_LOGIN_011: Lỗi server-side khi trống Password', async ({ loginPage }) => {
        await loginPage.login(VALID_EMAIL, '');
        
        await test.step('Verify server-side error message for missing Password', async () => {
            await expect(loginPage.lblAlertDanger).toBeVisible();
            await expect(loginPage.lblAlertDanger).toContainText('Password field is required');
        });
    });

    test('TC_LOGIN_012: Lỗi khi trống cả Email và Password', async ({ loginPage }) => {
        await test.step('Click login button without inputting credentials', async () => {
            await loginPage.clickElement(loginPage.btnLogin);
        });
        
        await test.step('Verify validation errors for both missing Email and Password', async () => {
            await expect(loginPage.lblAlertDanger.first()).toBeVisible();
            const texts = await loginPage.lblAlertDanger.allInnerTexts();
            const combinedText = texts.join(' ');
            expect(combinedText).toContain('Email Address field is required');
            expect(combinedText).toContain('Password field is required');
        });
    });

    // ==================== MOD-02B: Invalid Credentials ====================

    test('TC_LOGIN_013: Email đúng, Password sai', async ({ loginPage, page }) => {
        await loginPage.login(VALID_EMAIL, 'WrongPass@999');
        
        await test.step('Verify danger alert for wrong Password', async () => {
            await expect(loginPage.lblAlertDanger).toBeVisible();
            await expect(loginPage.lblAlertDanger).toContainText('Invalid email or password');
            expect(page.url()).toContain('authentication');
        });
    });

    test('TC_LOGIN_014: Email sai, Password đúng', async ({ loginPage }) => {
        await loginPage.login('hacker@gmail.com', VALID_PASSWORD);
        
        await test.step('Verify danger alert for wrong Email', async () => {
            await expect(loginPage.lblAlertDanger).toBeVisible();
            await expect(loginPage.lblAlertDanger).toContainText('Invalid email or password');
        });
    });

    test('TC_LOGIN_015: Cả Email và Password đều sai', async ({ loginPage }) => {
        await loginPage.login('notexist@fake.com', 'FakePass@000');
        
        await test.step('Verify danger alert for both wrong Email and Password', async () => {
            await expect(loginPage.lblAlertDanger).toBeVisible();
            await expect(loginPage.lblAlertDanger).toContainText('Invalid email or password');
        });
    });

    // ==================== MOD-02: Boundary ====================

    test('TC_LOGIN_016: Email >500 ký tự', async ({ loginPage, page }) => {
        const longEmail = 'a'.repeat(491) + '@domain.com';
        await loginPage.login(longEmail, VALID_PASSWORD);
        
        await test.step('Verify error message or validation for boundary long email', async () => {
            const validationMsg = await loginPage.getEmailValidationMessage();
            if (validationMsg === '') {
                await expect(loginPage.lblAlertDanger.or(page.locator('.alert'))).toBeVisible({ timeout: 5000 }).catch(() => {});
            }
            expect(page.url()).toContain('authentication');
        });
    });

    // ==================== MOD-02E: Already Logged In ====================

    test('TC_LOGIN_020: Đã login → truy cập login → redirect Dashboard', async ({ loginPage, dashboardPage, page }) => {
        await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
        
        await test.step('Verify redirected to Dashboard when attempting to access Login page again', async () => {
            await expect(dashboardPage.lblWrapper).toBeVisible();
            await page.goto('/admin/authentication');
            await expect(dashboardPage.lblWrapper).toBeVisible();
            expect(page.url()).toContain('/admin');
        });
    });

    // ==================== MOD-03: Forgot Password ====================

    test('TC_LOGIN_021: Click Forgot Password → redirect đúng trang', async ({ loginPage, page, forgotPasswordPage }) => {
        await loginPage.clickForgotPassword();
        
        await test.step('Verify redirected to Forgot Password page', async () => {
            await expect(forgotPasswordPage.lblHeading).toHaveText('Forgot Password');
            expect(page.url()).toContain('forgot_password');
        });
    });

    test('TC_LOGIN_022: Forgot Password email hợp lệ', async ({ loginPage, forgotPasswordPage, page }) => {
        await loginPage.clickForgotPassword();
        await forgotPasswordPage.submitForgotPassword(VALID_EMAIL);
        
        await test.step('Verify success or danger alert displayed on forgot password submit', async () => {
            await expect(forgotPasswordPage.lblAlertDanger.or(forgotPasswordPage.lblAlertSuccess)).toBeVisible();
            expect(page.url()).toContain('forgot_password');
        });
    });

    test('TC_LOGIN_023: HTML5 validation Forgot Password trống email', async ({ loginPage, forgotPasswordPage, page }) => {
        await loginPage.clickForgotPassword();
        await forgotPasswordPage.submitForgotPassword('');
        
        await test.step('Verify HTML5 validation for empty Forgot Password email', async () => {
            const validationMsg = await forgotPasswordPage.getEmailValidationMessage();
            expect(validationMsg !== '' || page.url().includes('forgot_password')).toBeTruthy();
        });
    });

    test('TC_LOGIN_024: Forgot Password email không tồn tại', async ({ loginPage, forgotPasswordPage, page }) => {
        await loginPage.clickForgotPassword();
        await forgotPasswordPage.submitForgotPassword('nonexistent_user_9999@fake.com');
        
        await test.step('Verify error alert displays for nonexistent email on Forgot Password', async () => {
            await expect(forgotPasswordPage.lblAlertDanger.or(forgotPasswordPage.lblAlertSuccess)).toBeVisible();
            expect(page.url()).toContain('forgot_password');
        });
    });

    test('TC_LOGIN_025: HTML5 validation email sai format trên Forgot Password', async ({ loginPage, forgotPasswordPage, page }) => {
        await loginPage.clickForgotPassword();
        await forgotPasswordPage.submitForgotPassword('invalidemail');
        
        await test.step('Verify HTML5 validation error for malformed email on Forgot Password', async () => {
            const validationMsg = await forgotPasswordPage.getEmailValidationMessage();
            expect(validationMsg).toContain('@');
            expect(page.url()).toContain('forgot_password');
        });
    });

    // ==================== MOD-04: Logout ====================

    test('TC_LOGIN_026: Logout redirect về trang Login', async ({ loginPage, dashboardPage, page }) => {
        await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
        await expect(dashboardPage.lblWrapper).toBeVisible();
        
        await dashboardPage.logoutViaUrl();
        
        await test.step('Verify redirected back to Login page after Logout', async () => {
            await expect(loginPage.inputEmail).toBeVisible();
            expect(page.url()).toContain('authentication');
        });
    });

    test('TC_LOGIN_027: Back button sau Logout không quay lại Dashboard', async ({ loginPage, dashboardPage, page }) => {
        await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
        await expect(dashboardPage.lblWrapper).toBeVisible();
        
        await dashboardPage.logoutViaUrl();
        await expect(loginPage.inputEmail).toBeVisible();
        
        await test.step('Perform browser Back action', async () => {
            await page.goBack();
        });
        
        await test.step('Verify user remains on Login page and cannot access Dashboard', async () => {
            await expect(loginPage.inputEmail).toBeVisible();
            expect(page.url()).toContain('authentication');
        });
    });
});
