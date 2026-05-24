import { Page, Locator, expect, test } from '@playwright/test';
import { BasePage } from './base.page';

export class CustomersPage extends BasePage {
    // List Page Elements
    readonly btnNewCustomer: Locator;
    readonly inputSearch: Locator;
    readonly tableHeaderCompany: Locator;
    
    // Add/Detail Form Elements
    readonly inputCompany: Locator;
    readonly inputVat: Locator;
    readonly inputPhone: Locator;
    readonly inputWebsite: Locator;
    readonly btnGroupsDropdown: Locator;
    readonly btnCurrencyDropdown: Locator;
    readonly btnLanguageDropdown: Locator;
    readonly inputAddress: Locator;
    readonly inputCity: Locator;
    readonly inputState: Locator;
    readonly inputZip: Locator;
    readonly btnCountryDropdown: Locator;
    readonly inputCountrySearch: Locator;
    readonly btnSave: Locator;
    readonly btnSaveAndCreateContact: Locator;
    
    // Detail Header / Alert Elements
    readonly lblCustomerHeading: Locator;
    readonly lblAlertSuccess: Locator;

    constructor(page: Page) {
        super(page, '/admin/clients');
        
        // List Page Locators
        this.btnNewCustomer = page.locator('a.btn-primary:has-text("New Customer")');
        this.inputSearch = page.locator('div#DataTables_Table_0_filter input');
        this.tableHeaderCompany = page.locator('th:has-text("Company")');
        
        // Add/Detail Form Locators
        this.inputCompany = page.locator('#company');
        this.inputVat = page.locator('#vat');
        this.inputPhone = page.locator('#phonenumber');
        this.inputWebsite = page.locator('#website');
        this.btnGroupsDropdown = page.locator('button[data-id="groups_in[]"]');
        this.btnCurrencyDropdown = page.locator('button[data-id="default_currency"]');
        this.btnLanguageDropdown = page.locator('button[data-id="default_language"]');
        this.inputAddress = page.locator('#address');
        this.inputCity = page.locator('#city');
        this.inputState = page.locator('#state');
        this.inputZip = page.locator('#zip');
        this.btnCountryDropdown = page.locator('button[data-id="country"]');
        this.inputCountrySearch = page.locator('div.bootstrap-select.country div.bs-searchbox input');
        this.btnSave = page.locator('button.only-save');
        this.btnSaveAndCreateContact = page.locator('button:not(.only-save).customer-form-submiter');
        
        // Detail Header Locators
        this.lblCustomerHeading = page.locator('h4 span.tw-truncate');
        this.lblAlertSuccess = page.locator('div.alert.alert-success');
    }

    async clickNewCustomer() {
        await test.step('Click New Customer button', async () => {
            await this.clickElement(this.btnNewCustomer);
        });
    }

    async fillCustomerForm(data: {
        company: string,
        vat?: string,
        phone?: string,
        website?: string,
        address?: string,
        city?: string,
        state?: string,
        zip?: string,
        country?: string
    }) {
        await test.step('Fill Customer Information Form', async () => {
            await test.step(`Enter company name: "${data.company}"`, async () => {
                await this.fillText(this.inputCompany, data.company);
            });

            if (data.vat) {
                await test.step(`Enter VAT number: "${data.vat}"`, async () => {
                    await this.fillText(this.inputVat, data.vat);
                });
            }

            if (data.phone) {
                await test.step(`Enter phone number: "${data.phone}"`, async () => {
                    await this.fillText(this.inputPhone, data.phone);
                });
            }

            if (data.website) {
                await test.step(`Enter website URL: "${data.website}"`, async () => {
                    await this.fillText(this.inputWebsite, data.website);
                });
            }

            if (data.address) {
                await test.step(`Enter address: "${data.address}"`, async () => {
                    await this.fillText(this.inputAddress, data.address);
                });
            }

            if (data.city) {
                await test.step(`Enter city: "${data.city}"`, async () => {
                    await this.fillText(this.inputCity, data.city);
                });
            }

            if (data.state) {
                await test.step(`Enter state: "${data.state}"`, async () => {
                    await this.fillText(this.inputState, data.state);
                });
            }

            if (data.zip) {
                await test.step(`Enter zip code: "${data.zip}"`, async () => {
                    await this.fillText(this.inputZip, data.zip);
                });
            }

            if (data.country) {
                await test.step(`Select country: "${data.country}"`, async () => {
                    await this.clickElement(this.btnCountryDropdown);
                    const option = this.page.locator('div.bootstrap-select:has(button[data-id="country"]) div.dropdown-menu a').filter({ hasText: data.country });
                    await this.clickElement(option);
                });
            }
        });
    }

    async saveCustomer() {
        await test.step('Click Save button', async () => {
            await this.clickElement(this.btnSave);
        });
    }

    async getHeaderText(): Promise<string> {
        return await test.step('Get created customer header text', async () => {
            return await this.getText(this.lblCustomerHeading);
        });
    }
}
