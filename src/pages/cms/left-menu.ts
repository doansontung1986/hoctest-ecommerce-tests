import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";
import { ProductPage } from "./products-page";

export class LeftMenu extends BasePage {
  readonly productsMenu: Locator;
  constructor(page: Page) {
    super(page);
    this.productsMenu = page
      .locator("#menu-posts-product")
      .getByRole("link", { name: "Products", exact: true });
  }

  async clickProductsMenu(): Promise<ProductPage> {
    await this.productsMenu.click();
    return new ProductPage(this.page);
  }
}
