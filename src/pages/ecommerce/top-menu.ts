import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";
import { SearchResultPage } from "./search-result-page";
import { ProductDetailPage } from "./product-detail-page";
import { ProductListingPage } from "./product-listing-page";

export class TopMenu extends BasePage {
  readonly searchTextbox: Locator;
  readonly searchSubmitBtn: Locator;
  readonly homeMenu: Locator;
  readonly courseListMenu: Locator;
  readonly blogMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.searchTextbox = page.getByPlaceholder("Search products...");
    this.searchSubmitBtn = page.locator("button[type='submit']");
    this.homeMenu = page.getByRole("link", { name: "Trang chủ" });
    this.courseListMenu = page.getByRole("link", {
      name: "Danh sách khoá học",
    });
    this.blogMenu = page.getByRole("link", { name: "Blog" });
  }

  async searchForKeyword(keyword: string): Promise<SearchResultPage> {
    await this.searchTextbox.fill(keyword);
    await this.searchSubmitBtn.click();
    return new SearchResultPage(this.page);
  }

  async clickCourseListMenu(): Promise<ProductListingPage> {
    await this.courseListMenu.click();
    return new ProductListingPage(this.page);
  }
}
