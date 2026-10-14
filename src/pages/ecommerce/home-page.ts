import { Locator, Page } from "@playwright/test";
import { SearchResultPage } from "./search-result-page";
import { ProductDetailPage } from "./product-detail-page";
import { BasePage } from "../base-page";

export class HomePage extends BasePage {
  readonly searchTextbox: Locator;
  readonly searchSubmitBtn: Locator;
  readonly homeMenu: Locator;
  readonly courseListMenu: Locator;
  readonly blogMenu: Locator;
  readonly courseList: Locator;

  constructor(page: Page) {
    super(page);
    this.searchTextbox = page.getByPlaceholder("Search products...");
    this.searchSubmitBtn = page.locator("button[type='submit']");
    this.homeMenu = page.getByRole("link", { name: "Trang chủ" });
    this.courseListMenu = page.getByRole("link", {
      name: "Danh sách khoá học",
    });
    this.blogMenu = page.getByRole("link", { name: "Blog" });
    this.courseList = page.locator(
      "#site-content ul.wc-block-product-template li",
    );
  }

  async goToEcommerceSite(): Promise<void> {
    await this.page.goto("/");
  }

  async searchForKeyword(keyword: string): Promise<SearchResultPage> {
    await this.searchTextbox.fill(keyword);
    await this.searchSubmitBtn.click();
    return new SearchResultPage(this.page);
  }

  async selectCourse(courseName: string): Promise<ProductDetailPage> {
    this.courseList.filter({ hasText: courseName }).click();
    return new ProductDetailPage(this.page);
  }
}
