import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page";

test.describe("Home Page Test", () => {
  let homePage: HomePage;
  test.beforeAll(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test.afterAll(async ({ page }) => {
    await page.close();
  });

  test("Verify Home Page loaded successfully", async ({ page }) => {
    await test.step("Go to Ecommerce site testing", async () => {
      await homePage.goToEcommerceSite();
    });

    await expect(page).toHaveTitle(
      "E-commerce site testing – Website thực hành – hoctest.com",
    );
    await expect(homePage.searchTextbox).toBeVisible();
    await expect(homePage.homeMenu).toBeVisible();
    await expect(homePage.courseListMenu).toBeVisible();
    await expect(homePage.blogMenu).toBeVisible();
  });
});
