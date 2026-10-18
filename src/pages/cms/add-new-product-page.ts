import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../base-page";
import { tr } from "@faker-js/faker";
import { ProductData } from "../../utils/generate-test-data";
import { ProductPage } from "./products-page";

export class AddNewProductPage extends BasePage {
  readonly productNameField: Locator;
  readonly producDescriptionSection: Locator;
  readonly producDescriptionArea: Locator;
  readonly postboxes: Record<string, Locator>;
  readonly productTypeDropdown: Locator;
  readonly productTypeOptions: Locator;
  readonly virtualChkbox: Locator;
  readonly downloadableChkbox: Locator;
  readonly productDataTabs: Record<string, { tab: Locator; panel: Locator }>;
  readonly general: Record<string, Locator>;
  readonly inventory: Record<string, Locator>;
  readonly shipping: Record<string, Locator>;
  readonly linkedProducts: Record<string, Locator>;
  readonly attributes: Record<string, Locator>;
  readonly advanced: Record<string, Locator>;
  readonly publishBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.productNameField = page.locator("#title");
    this.producDescriptionSection = page.locator("#postdivrich h2");
    this.producDescriptionArea = page
      .frameLocator("#excerpt_ifr")
      .locator("#tinymce");

    const box = (id: string) => page.locator(`#${id}`);
    this.postboxes = {
      productData: box("woocommerce-product-data"),
      shortDescription: box("postexcerpt"),
      publish: box("submitdiv"),
      productImage: box("postimagediv"),
      productGallery: box("woocommerce-product-images"),
      productCategory: box("product_catdiv"),
      productTags: box("tagsdiv-product_tag"),
      brands: box("product_branddiv"),
    };
    this.productTypeDropdown = page.locator("#product-type");
    this.productTypeOptions = this.productTypeDropdown.locator("option");
    this.virtualChkbox = page.getByRole("checkbox", {
      name: "Virtual",
      exact: true,
    });
    this.downloadableChkbox = page.getByRole("checkbox", {
      name: "Downloadable",
      exact: true,
    });

    const producData = page.locator("#woocommerce-product-data");

    const tab = (cls: string, panelId: string) => ({
      tab: producData.locator(`ul.product_data_tabs li.${cls} a`),
      panel: producData.locator(`#${panelId}`),
    });

    this.productDataTabs = {
      general: tab("general_tab", "general_product_data"),
      inventory: tab("inventory_tab", "inventory_product_data"),
      shipping: tab("shipping_tab", "shipping_product_data"),
      linkedProducts: tab("linked_product_tab", "linked_product_data"),
      attributes: tab("attribute_tab", "product_attributes"),
      advanced: tab("advanced_tab", "advanced_product_data"),
    };

    this.general = {
      regularPrice: page.locator("#_regular_price"),
      salePrice: page.locator("#_sale_price"),
      scheduleLink: page.locator("#general_product_data a.sale_schedule"),
      taxStatus: page.locator("#_tax_status"),
      taxClass: page.locator("#_tax_class"),
    };

    this.inventory = {
      sku: page.locator("#_sku"),
      gtin: page.locator("#_global_unique_id"),
      manageStock: page.locator("#_manage_stock"),
      inStock: page.getByRole("radio", { name: "In stock", exact: true }),
      outOfStock: page.getByRole("radio", {
        name: "Out of stock",
        exact: true,
      }),
      onBackorder: page.getByRole("radio", {
        name: "On backorder",
        exact: true,
      }),
      soldIndividually: page.locator("#_sold_individually"),
    };

    this.shipping = {
      weight: page.locator("#_weight"),
      length: page.locator("#product_length"),
      width: page.locator("#product_width"),
      height: page.locator("#product_height"),
      shippingClass: page.locator("#product_shipping_class"),
    };

    this.linkedProducts = {
      upsells: page.locator("#upsell_ids + .select2"),
      crossSells: page.locator("#crosssell_ids + .select2"),
    };

    const attr = page.locator("#product_attributes");

    this.attributes = {
      addExisting: attr.locator("select.wc-attribute-search"),
      addNewButton: attr.locator("button.add_custom_attribute"),
      firstName: attr.locator('input[name="attribute_names[0]"]'),
      firstValues: attr.locator('textarea[name="attribute_values[0]"]'),
      firstVisible: attr.locator('input[name="attribute_visibility[0]"]'),
      saveAttributes: attr.locator("button.save_attributes"),
    };

    this.advanced = {
      purchaseNote: page.locator("#_purchase_note"),
      menuOrder: page.locator("#menu_order"),
      enableReviews: page.locator("#comment_status"),
      availableInPos: page.locator("#_visible_in_pos"),
    };

    this.publishBtn = page.getByRole("button", { name: "Publish" });
  }

  private async isCollapse(box: Locator): Promise<boolean> {
    return box.evaluate((el) => el.classList.contains("closed"));
  }

  private async togglePostbox(box: Locator): Promise<void> {
    const saved = this.page.waitForResponse(
      (r) =>
        r.url().includes("admin-ajax.php") &&
        (r.request().postData() ?? "").includes("closed-postboxes"),
    );
    await box.getByRole("button", { name: "Show or hide panel" }).click();
    await saved;
  }

  async expandAllBocks(): Promise<void> {
    for (const box of Object.values(this.postboxes)) {
      if (await this.isCollapse(box)) await this.togglePostbox(box);
      await expect(box).not.toContainClass("postbox closed");
    }
  }

  async collapseAllBocks(): Promise<void> {
    for (const box of Object.values(this.postboxes)) {
      if ((await this.isCollapse(box)) == false) await this.togglePostbox(box);
      await expect(box).toContainClass("postbox closed");
    }
  }

  async verifyAllBlocksVisible(): Promise<void> {
    for (const box of Object.values(this.postboxes)) {
      await expect(box).toBeVisible();
    }
  }

  async addNewProduct(productData: ProductData): Promise<ProductPage> {
    await this.productNameField.fill(productData.productName);
    await this.producDescriptionArea.fill(productData.productDescription);
    await this.productTypeDropdown.selectOption(productData.productType);

    if (
      this.productTypeOptions.filter({
        hasText: "Simple product",
      })
    ) {
      await this.virtualChkbox.check();
    }

    const { regularPrice, salePrice } = this.general;
    await regularPrice.fill(productData.regularPrice);
    await salePrice.fill(productData.salePrice);
    await this.publishBtn.click();
    return new ProductPage(this.page);
  }
}
