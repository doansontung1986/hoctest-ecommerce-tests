import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";
import { AddNewProductPage } from "./add-new-product-page";
import { ProductDetailPage } from "../ecommerce/product-detail-page";
import { ProductData } from "../../utils/generate-test-data";

export class ProductPage extends BasePage {
  readonly addNewProductBtn: Locator;
  readonly productSuccessPublishedMessage: Locator;
  readonly productUpdatedMessage: Locator;
  readonly viewProductLnk: Locator;
  readonly productList: Locator;
  readonly bulkActionDropdown: Locator;
  readonly applyBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewProductBtn = page
      .locator(".wrap")
      .getByRole("link", { name: "Add new product" });
    this.productSuccessPublishedMessage = page.locator(
      "#message.notice-success",
    );
    this.viewProductLnk = this.productSuccessPublishedMessage.getByRole(
      "link",
      {
        name: "View Product",
      },
    );
    this.productUpdatedMessage = page.locator("#message.updated");
    this.productList = page.locator("#the-list tr");
    this.bulkActionDropdown = page.locator("#bulk-action-selector-top");
    this.applyBtn = page.locator("#doaction");
  }

  async clickAddNewProductButton(): Promise<AddNewProductPage> {
    await this.addNewProductBtn.click();
    return new AddNewProductPage(this.page);
  }

  async clickViewProductButton(): Promise<ProductDetailPage> {
    await this.viewProductLnk.click();
    return new ProductDetailPage(this.page);
  }

  async getCreatedProductInfo(product: ProductData): Promise<{
    productName: Locator;
    productRegularPrice: Locator;
    productSalePrice: Locator;
    productCheckbox: Locator;
  }> {
    const createdProduct = this.productList.filter({
      hasText: product.productName,
    });
    const productName = createdProduct.locator("th");
    const productRegularPrice = createdProduct.locator(
      "td.price del .woocommerce-Price-amount",
    );
    const productSalePrice = createdProduct.locator(
      "td.price ins .woocommerce-Price-amount",
    );
    const productCheckbox = createdProduct.locator("td.check-column input");
    return {
      productName,
      productRegularPrice,
      productSalePrice,
      productCheckbox,
    };
  }
}
