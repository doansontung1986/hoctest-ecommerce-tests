import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export class RegisterPage extends BasePage {
  readonly registerNoticeMessage: Locator;
  readonly userNameField: Locator;
  readonly emailField: Locator;
  readonly regEmailMessage: Locator;
  readonly registerBtn: Locator;
  readonly loginLnk: Locator;
  readonly lostYourPasswordLnk: Locator;
  readonly goToEcommerceSietLnk: Locator;

  constructor(page: Page) {
    super(page);
    this.registerNoticeMessage = page.locator(
      ".notice.notice-info.message.register p",
    );
    this.userNameField = page.getByRole("textbox", { name: "Username" });
    this.emailField = page.getByRole("textbox", { name: "Email" });
    this.regEmailMessage = page.locator("#reg_passmail");
    this.registerBtn = page.getByRole("button", { name: "Register" });
    this.loginLnk = page.locator(".wp-login-log-in");
    this.lostYourPasswordLnk = page.locator(".wp-login-lost-password");
    this.goToEcommerceSietLnk = page.locator("#backtoblog a");
  }
}
