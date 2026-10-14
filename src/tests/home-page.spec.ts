import { test, expect, Locator, chromium } from "@playwright/test";
import { HomePage } from "../pages/ecommerce/home-page";
import { SearchResultPage } from "../pages/ecommerce/search-result-page";
import { ProductDetailPage } from "../pages/ecommerce/product-detail-page";
import { createReviewInfo } from "../utils/generate-test-data";

test.describe("Home Page Test", { tag: "@home" }, () => {
  let homePage: HomePage;
  let searchResult: SearchResultPage;
  let productDetaiPage: ProductDetailPage;
  let homePage2: HomePage;
  let productDetaiPage2: ProductDetailPage;

  const data = {
    keyword: "ISTQB",
    product: {
      name: "FullStack Automation QA với Playwright Typescript",
      price: "2.499.000 $",
      discount_price: "1.749.000 $",
      description:
        "Khoá học automation test từ chưa biết gì, với Playwright TypeScript",
      in_stock: true,
    },

    review_info: createReviewInfo({
      rating: 5,
      your_review: "Khóa học chất lượng",
      save_info: true,
    }),
  };

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goToEcommerceSite();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("HOME_001: Verify Home Page loaded successfully", async ({ page }) => {
    await test.step("Verify Ecommerce website title", async () => {
      await expect(page).toHaveTitle(
        "E-commerce site testing – Website thực hành – hoctest.com",
      );
    });

    await test.step("Verify searchbox", async () => {
      await expect(homePage.searchTextbox).toBeVisible();
    });

    await test.step("Verify menu", async () => {
      await expect(homePage.homeMenu).toBeVisible();
      await expect(homePage.courseListMenu).toBeVisible();
      await expect(homePage.blogMenu).toBeVisible();
    });
  });

  test("HOME_002: Verify search box work properly", async ({ page }) => {
    await test.step("Search for a keyword", async () => {
      searchResult = await homePage.searchForKeyword(data.keyword);
    });

    await test.step("Verify product card contains ISTQB", async () => {
      const productList: Locator =
        await searchResult.getProductListMatchKeyword(data.keyword);

      (await productList.all()).forEach((product) =>
        expect(product).toContainText("ISTQB"),
      );
    });

    await test.step("Verify text showing number of results", async () => {
      await expect(searchResult.showingTextResult).toBeVisible();
    });

    await test.step("Verify the total product cards match the number of results", async () => {
      const productList: Locator =
        await searchResult.getProductListMatchKeyword(data.keyword);
      const numberOfResults =
        await searchResult.getCountFromShowingResultText();
      expect(productList).toHaveCount(numberOfResults);
    });
  });

  test("HOME_003: Verify product information", async ({ page }) => {
    await test.step("Select a course", async () => {
      productDetaiPage = await homePage.selectCourse(data.product.name);
    });

    await test.step("Verify information on PDP", async () => {
      await expect(productDetaiPage.productNameLoc).toHaveText(
        data.product.name,
      );
      await expect(productDetaiPage.priceLoc).toHaveText(data.product.price);
      await expect(productDetaiPage.discountPriceLoc).toHaveText(
        data.product.discount_price,
      );
      await expect(productDetaiPage.description).toHaveText(
        data.product.description,
      );
    });

    await test.step("Verify Add to Cart CTA behavior", async () => {
      /* If the product is in-stock, then 'Add to Cart' CTA is enabled and clickable.
        Otherwise, 'Add to Cart' CTA is disabled 
    */
      if (data.product.in_stock) {
        await productDetaiPage.clickAddToCart();
        await expect(productDetaiPage.message).toContainText(data.product.name);
      } else {
        await expect(productDetaiPage.addtoCartBtn).toBeDisabled();
      }
    });

    await test.step("Click on Review tab on PDP", async () => {
      await productDetaiPage.clickReviewsTab();
    });

    await test.step("Verify there is no reviews", async () => {
      await expect(productDetaiPage.noReviewText).toContainText(
        "There are no reviews yet.",
      );
    });
  });

  test("HOME_004: Verify product review", async ({ browser }) => {
    await test.step("Go to PDP and click on review tab", async () => {
      productDetaiPage = await homePage.selectCourse(data.product.name);
      await productDetaiPage.clickReviewsTab();
    });

    await test.step("Verify there is no reviews", async () => {
      await expect(productDetaiPage.noReviewText).toContainText(
        "There are no reviews yet.",
      );
    });

    await test.step("Verify inforrmation on the review form", async () => {
      expect(await productDetaiPage.ratingStar.all()).toHaveLength(5);
      await expect(productDetaiPage.yourReviewArea).toBeVisible();
      await expect(productDetaiPage.reviewerName).toBeVisible();
      await expect(productDetaiPage.reviewerEmail).toBeVisible();
      await expect(
        productDetaiPage.saveInfoForNextReviewCheckbox,
      ).toBeVisible();
    });

    await test.step("Post a review", async () => {
      await productDetaiPage.postReview(data.review_info);
    });

    await test.step("Verify the posted review", async () => {
      await expect(productDetaiPage.ratedReviewStar).toHaveAttribute(
        "aria-label",
      );
      await expect(productDetaiPage.reviewDescription).toHaveText(
        data.review_info.your_review,
      );
    });

    await test.step("Refresh browser and check the posted review is persistent", async () => {
      await productDetaiPage.refreshBrowser();

      await expect(productDetaiPage.ratedReviewStar).toHaveAttribute(
        "aria-label",
      );
      await expect(productDetaiPage.reviewDescription).toHaveText(
        data.review_info.your_review,
      );
    });

    await test.step("Open new browser and go to Ecommerce site", async () => {
      const context = await browser.newContext();
      const page2 = await context.newPage();
      homePage2 = new HomePage(page2);
      await homePage2.goToEcommerceSite();
    });

    await test.step("Select a course and click on Review tab", async () => {
      productDetaiPage2 = await homePage2.selectCourse(data.product.name);
      await productDetaiPage2.clickReviewsTab();
    });

    await test.step("Verify there is no reviews", async () => {
      await expect(productDetaiPage2.noReviewText).toContainText(
        "There are no reviews yet.",
      );
    });
  });
});
