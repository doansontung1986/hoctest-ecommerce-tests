import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/cms/login-page";
import { RegisterPage } from "../pages/cms/register-page";
import { LostYourPasswordPage } from "../pages/cms/lost-your-password-page";
import { DashboardPage } from "../pages/cms/dashboard-page";
import { createCredentialInfo } from "../utils/generate-test-data";

test.describe("Authentication Test", { tag: "@authentication" }, () => {
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let lostYourPasswordPage: LostYourPasswordPage;
  let dashboardPage: DashboardPage;

  const credentials = {
    valid: createCredentialInfo({
      username: "k26-sontung",
      password: "cZV#mLE1O9x$Da05j64iJS2B",
      rememberMe: true,
      shouldSuccess: true,
    }),
    invalid_user: createCredentialInfo({
      password: "zi%$zl1IlK2zGhcQ2*A)2wKC",
    }),
    invalid_password: createCredentialInfo({
      username: "k26-sontung",
    }),
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goToEcommerceCMS();
  });

  test.afterEach(async ({ page }) => {
    // await page.close();
  });

  test("Verify UI on Authentication page", async ({ page }) => {
    await test.step("Verify UI on Login page", async () => {
      await expect(loginPage.userNameField).toBeEditable();
      await expect(loginPage.passwordField).toBeEditable();
      await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
      await expect(loginPage.loginBtn).toBeEnabled();
      await expect(loginPage.registerLnk).toBeEnabled();
      await expect(loginPage.lostYourPasswordLnk).toBeEnabled();
      await expect(loginPage.goToEcommerceSietLnk).toBeEnabled();
    });

    await test.step("Verify Register link and UI on Register page", async () => {
      registerPage = await loginPage.clickRegisterLink();

      await expect(registerPage.registerNoticeMessage).toBeVisible();
      await expect(registerPage.userNameField).toBeEditable();
      await expect(registerPage.emailField).toBeEditable();
      await expect(registerPage.regEmailMessage).toBeVisible();
      await expect(registerPage.registerBtn).toBeEnabled();
      await expect(registerPage.loginLnk).toBeEnabled();
      await expect(registerPage.lostYourPasswordLnk).toBeEnabled();
      await expect(registerPage.goToEcommerceSietLnk).toBeEnabled();

      // Go back to Login page
      await registerPage.goBack();
    });

    await test.step("Verify Lost Your Password link and UI on Lost Your Password page", async () => {
      lostYourPasswordPage = await loginPage.clickLostYourPasswordLink();

      await expect(lostYourPasswordPage.noticeMessage).toBeVisible();
      await expect(lostYourPasswordPage.userNameField).toBeEditable();
      await expect(lostYourPasswordPage.getNewPasswordBtn).toBeEnabled();
      await expect(lostYourPasswordPage.loginLnk).toBeEnabled();
      await expect(lostYourPasswordPage.registerLnk).toBeEnabled();
      await expect(lostYourPasswordPage.goToEcommerceSietLnk).toBeEnabled();
    });
  });

  test("Verify success authentication with valid credentials", async ({
    page,
  }) => {
    await test.step("Login to Ecommerce CMS", async () => {
      dashboardPage = (await loginPage.authenticate(
        credentials.valid,
      )) as DashboardPage;
    });

    await test.step("Verify UI on Dashboard page", async () => {
      await expect(dashboardPage.atAGlanceHeading).toBeVisible();
      await expect(dashboardPage.activityHeading).toBeVisible();
      await expect(dashboardPage.wooCommerceRecentReviewsHeading).toBeVisible();
    });
  });

  test("Verify failure authentication with bad credentials", async ({
    page,
  }) => {
    await test.step("Check with user that not exists", async () => {
      await loginPage.authenticate(credentials.invalid_user);
      await expect(loginPage.errorMessage).toContainText(
        `Error: The username ${credentials.invalid_user.username} is not registered on this site. If you are unsure of your username, try your email address instead.`,
      );
    });

    await test.step("Go to CMS login page again", async () => {
      await loginPage.goToEcommerceCMS();
    });

    await test.step("Check with user that exists, but wrong password", async () => {
      await loginPage.authenticate(credentials.invalid_password);
      await expect(loginPage.errorMessage).toContainText(
        `Error: The password you entered for the username ${credentials.invalid_password.username} is incorrect. Lost your password?`,
      );
    });
  });
});
