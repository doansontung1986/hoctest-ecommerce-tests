import { Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async refreshBrowser(): Promise<void> {
    await this.page.reload({ waitUntil: "load" });
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }
}
