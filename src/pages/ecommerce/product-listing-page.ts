import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class ProductListingPage extends BasePage {
  readonly courseList: Locator;
  constructor(page: Page) {
    super(page);
    this.courseList = page.locator(".products li");
  }
}
