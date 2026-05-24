import { test, expect } from '../../fixtures/base.fixture';
import { EnvConfig } from '../../utils/env.config';
import { TestDataGenerator } from '../../utils/test-data';

test.describe('CRM Customers - Customer Management', () => {

    const ADMIN_EMAIL = EnvConfig.ADMIN_USERNAME;
    const ADMIN_PASS = EnvConfig.ADMIN_PASSWORD;

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
        await loginPage.login(ADMIN_EMAIL, ADMIN_PASS);
    });

    test('TC_CUSTOMER_001: Add new Customer thành công', async ({ dashboardPage, customersPage, page }) => {
        
        // Step 1: Đi tới trang Customers từ Dashboard
        await test.step('Navigate to Customers module from Dashboard', async () => {
            await expect(dashboardPage.lblWrapper).toBeVisible();
            await page.getByRole('link', { name: ' Customers' }).click();
            await expect(page).toHaveURL(/.*clients/);
        });

        // Step 2: Mở form tạo mới Customer
        await customersPage.clickNewCustomer();
        await test.step('Verify Add New Customer page loaded', async () => {
            await expect(page).toHaveURL(/.*clients\/client/);
            await expect(customersPage.inputCompany).toBeVisible();
        });

        // Step 3: Nhập thông tin Customer
        const uniqueCompany = TestDataGenerator.generateUniqueUsername('AutoCompany');
        const customerData = {
            company: uniqueCompany,
            vat: `VAT_${Date.now()}`,
            phone: '0123456789',
            website: 'https://anhtester.com',
            address: '123 Main Street',
            city: 'Ho Chi Minh',
            state: 'Thu Duc',
            zip: '70000',
            country: 'Vietnam'
        };

        await customersPage.fillCustomerForm(customerData);

        // Step 4: Click Save
        await customersPage.saveCustomer();

        // Step 5: Verify Customer được tạo thành công
        await test.step('Verify Customer created successfully and redirected to detail page', async () => {
            // Đợi redirect sang trang detail có dạng clients/client/[id]
            await expect(page).toHaveURL(/.*clients\/client\/\d+/);
            
            // Đợi header hiển thị chính xác tên công ty mới tạo
            const headerText = await customersPage.getHeaderText();
            expect(headerText).toContain(uniqueCompany);
        });
    });
});
