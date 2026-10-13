import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class ProductDetailPage extends BasePage {
  readonly productNameLoc: Locator;
  readonly priceLoc: Locator;
  readonly discountPriceLoc: Locator;
  readonly addtoCartBtn: Locator;
  readonly description: Locator;
  readonly message: Locator;
  readonly reviewsTab: Locator;
  readonly noReviewText: Locator;
  readonly ratingStar: Locator;
  readonly yourReviewArea: Locator;
  readonly reviewerName: Locator;
  readonly reviewerEmail: Locator;
  readonly saveInfoForNextReviewCheckbox: Locator;
  readonly reviewSubmitBtn: Locator;
  readonly ratedReviewStar: Locator;
  readonly reviewDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.productNameLoc = page.locator(".product_title");
    this.priceLoc = page.locator(
      ".summary .price del .woocommerce-Price-amount",
    );
    this.discountPriceLoc = page.locator(
      ".summary .price ins .woocommerce-Price-amount",
    );
    this.addtoCartBtn = page
      .locator(".cart")
      .getByRole("button", { name: "Add to cart" });
    this.description = page.locator("#tab-description p");
    this.message = page.locator(".woocommerce-message");
    this.reviewsTab = page.locator("a[role='tab'][href='#tab-reviews']");
    this.noReviewText = page.locator("#comments p");
    this.ratingStar = page.locator(".stars a");
    this.yourReviewArea = page.locator("#comment");
    this.reviewerName = page.locator("#author");
    this.reviewerEmail = page.locator("#email");
    this.reviewSubmitBtn = page.getByRole("button", { name: /submit/i });
    this.saveInfoForNextReviewCheckbox = page.locator(
      "#wp-comment-cookies-consent",
    );
    this.ratedReviewStar = page.locator(".commentlist .star-rating");
    this.reviewDescription = page.locator(".commentlist .description");
  }

  async clickAddToCart(): Promise<void> {
    await this.addtoCartBtn.click();
  }

  async clickReviewsTab(): Promise<void> {
    await this.reviewsTab.click();
  }

  async postReview(reviewInfo: {
    rating: number;
    your_review: string;
    name: string;
    email: string;
    save_info: boolean;
  }): Promise<void> {
    await this.ratingStar.nth(reviewInfo.rating - 1).click();
    await this.yourReviewArea.fill(reviewInfo.your_review);
    await this.reviewerName.fill(reviewInfo.name);
    await this.reviewerEmail.fill(reviewInfo.email);
    if (reviewInfo.save_info) {
      await this.saveInfoForNextReviewCheckbox.check();
    } else {
      await this.saveInfoForNextReviewCheckbox.uncheck();
    }
    await this.reviewSubmitBtn.click();
  }
}
