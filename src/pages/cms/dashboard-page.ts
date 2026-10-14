import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class DashboardPage extends BasePage {
  readonly atAGlanceHeading: Locator;
  readonly activityHeading: Locator;
  readonly wooCommerceRecentReviewsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.atAGlanceHeading = page.getByRole("heading", { name: "At a Glance" });
    this.activityHeading = page.getByRole("heading", { name: "Activity" });
    this.wooCommerceRecentReviewsHeading = page.getByRole("heading", {
      name: "WooCommerce Recent Reviews",
    });
  }
}
