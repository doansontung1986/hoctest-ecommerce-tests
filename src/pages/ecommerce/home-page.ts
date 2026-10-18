import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";
import { ProductDetailPage } from "./product-detail-page";

export class HomePage extends BasePage {
  readonly courseList: Locator;
  constructor(page: Page) {
    super(page);
    this.courseList = page.locator(
      "#site-content ul.wc-block-product-template li",
    );
  }

  async selectCourse(courseName: string): Promise<ProductDetailPage> {
    this.courseList.filter({ hasText: courseName }).click();
    return new ProductDetailPage(this.page);
  }
}
