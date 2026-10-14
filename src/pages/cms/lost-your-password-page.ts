import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class LostYourPasswordPage extends BasePage {
  readonly noticeMessage: Locator;
  readonly userNameField: Locator;
  readonly getNewPasswordBtn: Locator;
  readonly loginLnk: Locator;
  readonly registerLnk: Locator;
  readonly goToEcommerceSietLnk: Locator;

  constructor(page: Page) {
    super(page);
    this.noticeMessage = page.locator(".notice.notice-info.message");
    this.userNameField = page.getByRole("textbox", {
      name: "Username or Email Address",
    });
    this.getNewPasswordBtn = page.getByRole("button", {
      name: "Get New Password",
    });
    this.loginLnk = page.locator(".wp-login-log-in");
    this.registerLnk = page.locator(".wp-login-register");
    this.goToEcommerceSietLnk = page.locator("#backtoblog a");
  }
}
