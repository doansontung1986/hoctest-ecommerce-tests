import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class SearchResultPage extends BasePage {
  readonly productList: Locator;
  readonly showingTextResult: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator(".products.columns-4 li");
    this.showingTextResult = page.locator(".woocommerce-result-count");
  }

  async getProductListMatchKeyword(keyword: string): Promise<Locator> {
    return this.productList.filter({ hasText: "ISTQB" });
  }

  async getCountFromShowingResultText(): Promise<number> {
    const showingTextResult: string = (
      await this.showingTextResult.innerText()
    ).trim();

    return parseInt(
      showingTextResult.replace("Showing all ", "").replace(" results", ""),
    );
  }
}
