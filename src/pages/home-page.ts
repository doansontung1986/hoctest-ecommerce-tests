import { Locator, Page } from "@playwright/test";

export class HomePage {
  page: Page;
  searchTextbox: Locator;
  homeMenu: Locator;
  courseListMenu: Locator;
  blogMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchTextbox = page.getByPlaceholder("Search products...");
    this.homeMenu = page.getByRole("link", { name: "Trang chủ" });
    this.courseListMenu = page.getByRole("link", {
      name: "Danh sách khoá học",
    });
    this.blogMenu = page.getByRole("link", { name: "Blog" });
  }

  async goToEcommerceSite(): Promise<void> {
    await this.page.goto("https://e-commerce-dev.betterbytesvn.com/");
  }
}
