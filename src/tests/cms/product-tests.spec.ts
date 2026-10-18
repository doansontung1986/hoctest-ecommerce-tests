import { expect, Locator, test } from "@playwright/test";
import { LoginPage } from "../../pages/cms/login-page";
import {
  createCredentialInfo,
  CredentialData,
  generateRandomNumber,
  ProductData,
} from "../../utils/generate-test-data";
import { formatPrice } from "../../utils/format-data";
import { LeftMenu } from "../../pages/cms/left-menu";
import { AddNewProductPage } from "../../pages/cms/add-new-product-page";
import { ProductPage } from "../../pages/cms/products-page";
import { ProductDetailPage } from "../../pages/ecommerce/product-detail-page";
import { HomePage } from "../../pages/ecommerce/home-page";
import { TopMenu } from "../../pages/ecommerce/top-menu";
import { ProductListingPage } from "../../pages/ecommerce/product-listing-page";

test.describe("Product CMS tests", { tag: "@product" }, () => {
  let loginPage: LoginPage;
  let leftMenu: LeftMenu;
  let productPage: ProductPage;
  let addNewProductPage: AddNewProductPage;
  let productDetailPage: ProductDetailPage;
  let homePageEcommerce: HomePage;
  let topMenuEcommerce: TopMenu;
  let productListingPageEcommerce: ProductListingPage;

  const credentials: CredentialData = createCredentialInfo({
    username: "k26-sontung",
    password: "cZV#mLE1O9x$Da05j64iJS2B",
    rememberMe: true,
    shouldSuccess: true,
  });

  const product: ProductData = {
    productName: `Tung - ${generateRandomNumber()} - FullStack Automation QA với Playwright Typescript`,
    productDescription: "Sản phẩm tạo từ code automation của học viên",
    productType: "Simple product",
    isVirtualProduct: true,
    regularPrice: "1000",
    salePrice: "850",
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goToEcommerceCMS();
    await loginPage.authenticate(credentials);
    leftMenu = new LeftMenu(page);
    homePageEcommerce = new HomePage(page);
    topMenuEcommerce = new TopMenu(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
  test("PRODUCT_001: Verify UI on Add New Product page", async ({}) => {
    await test.step("Go to Add New Product page", async () => {
      productPage = await leftMenu.clickProductsMenu();
      addNewProductPage = await productPage.clickAddNewProductButton();
    });

    await test.step("Verify UI blocks on Add New Product page", async () => {
      await expect(addNewProductPage.productNameField).toBeEditable();
      await expect(addNewProductPage.producDescriptionSection).toBeVisible();
      await addNewProductPage.verifyAllBlocksVisible();
    });

    await test.step("Expand all blocks and verify all blocks are expaned", async () => {
      await addNewProductPage.expandAllBocks();
    });

    await test.step("Collapse all blockes and verify all blocks are collapsed", async () => {
      await addNewProductPage.collapseAllBocks();
    });

    await test.step("Expand all blocks again", async () => {
      await addNewProductPage.expandAllBocks();
    });

    await test.step("Verify some product blocks visible and enabled", async () => {
      await expect(addNewProductPage.productNameField).toBeVisible();
      await expect(addNewProductPage.productNameField).toBeEnabled();

      await expect(addNewProductPage.producDescriptionSection).toBeVisible();
      await expect(addNewProductPage.producDescriptionSection).toBeEnabled();

      await expect(addNewProductPage.productTypeOptions).toHaveText([
        "Simple product",
        "Grouped product",
        "External/Affiliate product",
        "Variable product",
      ]);

      await expect(addNewProductPage.virtualChkbox).toBeVisible();
      await expect(addNewProductPage.virtualChkbox).toBeEnabled();

      await expect(addNewProductPage.downloadableChkbox).toBeVisible();
      await expect(addNewProductPage.downloadableChkbox).toBeEnabled();
    });

    await test.step("Verify fields on General tab", async () => {
      const { tab: generalTab, panel: general_product_data } =
        addNewProductPage.productDataTabs.general;
      await generalTab.click();
      await expect(general_product_data).toBeVisible();

      const { regularPrice, salePrice, scheduleLink, taxStatus, taxClass } =
        addNewProductPage.general;
      await expect(regularPrice).toBeVisible();
      await expect(salePrice).toBeVisible();
      await expect(scheduleLink).toBeVisible();
      await expect(taxStatus).toBeVisible();
      await expect(taxClass).toBeVisible();
    });

    await test.step("Verify fields on Inventory tab", async () => {
      const { tab: inventory_tab, panel: inventory_product_data } =
        addNewProductPage.productDataTabs.inventory;
      await inventory_tab.click();
      await expect(inventory_product_data).toBeVisible();

      const {
        sku,
        gtin,
        manageStock,
        inStock,
        outOfStock,
        onBackorder,
        soldIndividually,
      } = addNewProductPage.inventory;
      await expect(sku).toBeVisible();
      await expect(gtin).toBeVisible();
      await expect(manageStock).toBeVisible();
      await expect(inStock).toBeVisible();
      await expect(outOfStock).toBeVisible();
      await expect(onBackorder).toBeVisible();
      await expect(soldIndividually).toBeVisible();
    });

    await test.step("Verify fields on Shipping tab", async () => {
      const { tab: shipping_tab, panel: shipping_product_data } =
        addNewProductPage.productDataTabs.shipping;
      await shipping_tab.click();
      await expect(shipping_product_data).toBeVisible();

      const { weight, length, width, height, shippingClass } =
        addNewProductPage.shipping;
      await expect(weight).toBeVisible();
      await expect(length).toBeVisible();
      await expect(width).toBeVisible();
      await expect(height).toBeVisible();
      await expect(shippingClass).toBeVisible();
    });

    await test.step("Verify fields on Linked Products tab", async () => {
      const { tab: linked_product_tab, panel: linked_product_data } =
        addNewProductPage.productDataTabs.linkedProducts;
      await linked_product_tab.click();
      await expect(linked_product_data).toBeVisible();

      const { upsells, crossSells } = addNewProductPage.linkedProducts;
      await expect(upsells).toBeVisible();
      await expect(crossSells).toBeVisible();
    });

    await test.step("Verify fields on Attributes tab", async () => {
      const { tab: attribute_tab, panel: product_attributes } =
        addNewProductPage.productDataTabs.attributes;
      await attribute_tab.click();
      await expect(product_attributes).toBeVisible();

      const {
        addExisting,
        addNewButton,
        firstName,
        firstValues,
        firstVisible,
        saveAttributes,
      } = addNewProductPage.attributes;
      await expect(addExisting).toBeVisible();
      await expect(addNewButton).toBeVisible();
      await expect(firstName).toBeVisible();
      await expect(firstValues).toBeVisible();
      await expect(firstVisible).toBeVisible();
      await expect(saveAttributes).toBeVisible();
    });

    await test.step("Verify fields on Advanced tab", async () => {
      const { tab: advanced_tab, panel: advanced_product_data } =
        addNewProductPage.productDataTabs.advanced;
      await advanced_tab.click();
      await expect(advanced_product_data).toBeVisible();

      const { purchaseNote, menuOrder, enableReviews, availableInPos } =
        addNewProductPage.advanced;
      await expect(purchaseNote).toBeVisible();
      await expect(menuOrder).toBeVisible();
      await expect(enableReviews).toBeVisible();
      await expect(availableInPos).toBeVisible();
    });
  });

  test("PRODUCT_002: Verify that user can add and remove a product", async ({
    page,
  }) => {
    await test.step("Go to Add New Product page", async () => {
      productPage = await leftMenu.clickProductsMenu();
      addNewProductPage = await productPage.clickAddNewProductButton();
    });

    await test.step("Add a product in CMS", async () => {
      await addNewProductPage.addNewProduct(product);
      await expect(productPage.productSuccessPublishedMessage).toContainText(
        "Product published.",
      );
      productDetailPage = await productPage.clickViewProductButton();
    });

    await test.step("Verify created product on PDP", async () => {
      await expect(productDetailPage.productNameLoc).toHaveText(
        product.productName.replace(/ - /g, " – "),
      );
      await expect(productDetailPage.priceLoc).toHaveText(
        formatPrice(parseInt(product.regularPrice)),
      );
      await expect(productDetailPage.discountPriceLoc).toHaveText(
        formatPrice(parseInt(product.salePrice)),
      );
    });

    await test.step("Verify created product on PLP", async () => {
      await leftMenu.goBack();
      await leftMenu.clickProductsMenu();
      const { productName, productRegularPrice, productSalePrice } =
        await productPage.getCreatedProductInfo(product);

      await expect(productName).toContainText(product.productName);
      await expect(productRegularPrice).toContainText(
        formatPrice(parseInt(product.regularPrice)),
      );
      await expect(productSalePrice).toContainText(
        formatPrice(parseInt(product.salePrice)),
      );
    });

    await test.step("Delete the product on CMS", async () => {
      const { productCheckbox } =
        await productPage.getCreatedProductInfo(product);
      await productCheckbox.check();

      await productPage.bulkActionDropdown.selectOption({
        label: "Move to Trash",
      });
      await productPage.applyBtn.click();

      await expect(productPage.productUpdatedMessage).toContainText(
        "1 product moved to the Trash.",
      );

      await expect(
        productPage.productList.filter({
          hasText: product.productName.replace(/ - /g, " – "),
        }),
      ).toHaveCount(0);
    });

    await test.step("Verify the product is removed on Ecommerce site", async () => {
      await homePageEcommerce.goToEcommerceSite();
      productListingPageEcommerce =
        await topMenuEcommerce.clickCourseListMenu();

      await expect(
        productListingPageEcommerce.courseList.filter({
          hasText: product.productName.replace(/ - /g, " – "),
        }),
      ).toHaveCount(0);
    });
  });
});
