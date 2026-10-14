import { Locator, Page } from "@playwright/test";
import { DashboardPage } from "./dashboard-page";
import { LostYourPasswordPage } from "./lost-your-password-page";
import { CredentialData } from "../../utils/generate-test-data";
import { BasePage } from "../base-page";
import { RegisterPage } from "./register-page";

export class LoginPage extends BasePage {
  readonly userNameField: Locator;
  readonly passwordField: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginBtn: Locator;
  readonly registerLnk: Locator;
  readonly lostYourPasswordLnk: Locator;
  readonly goToEcommerceSietLnk: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameField = page.getByRole("textbox", {
      name: "Username or Email Address",
    });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.rememberMeCheckbox = page.getByRole("checkbox", {
      name: "Remember Me",
    });
    this.loginBtn = page.getByRole("button", { name: "Log In" });
    this.registerLnk = page.locator(".wp-login-register");
    this.lostYourPasswordLnk = page.locator(".wp-login-lost-password");
    this.goToEcommerceSietLnk = page.locator("#backtoblog a");
    this.errorMessage = page.locator("#login_error");
  }

  async goToEcommerceCMS(): Promise<void> {
    await this.page.goto("/wp-admin");
  }

  async authenticate(credentials: CredentialData): Promise<BasePage> {
    await this.userNameField.fill(credentials.username);
    await this.passwordField.fill(credentials.password);
    if (credentials.rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.loginBtn.click();

    if (credentials.shouldSuccess) {
      return new DashboardPage(this.page);
    }

    return new LoginPage(this.page);
  }

  async clickRegisterLink(): Promise<RegisterPage> {
    await this.registerLnk.click();
    return new RegisterPage(this.page);
  }

  async clickLostYourPasswordLink(): Promise<LostYourPasswordPage> {
    await this.lostYourPasswordLnk.click();
    return new LostYourPasswordPage(this.page);
  }
}
