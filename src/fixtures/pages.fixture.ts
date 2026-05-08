import { test as base } from "@playwright/test";
import { LoginPage } from "~/pages/auth/login.page";
import { MerchantPage } from "~/pages/merchant/merchant.page";
import { CustomerPage } from "~/pages/customer/customer.page";
import { ProductPage } from "~/pages/product/product.page";
import { CategoryPage } from "~/pages/category/category.page";
import { EmployeePage } from "~/pages/employee/employee.page";
import { UserPage } from "~/pages/user/user.page";
import { TerminalPage } from "~/pages/terminal/terminal.page";
import { TransactionPage } from "~/pages/transaction/transaction.page";
import { VirtualTerminalPage } from "~/pages/virtual-terminal/virtual-terminal.page";
import { HeaderComponent } from "~/pages/components/header.component";
import { LeftMenuComponent } from "~/pages/components/left-menu.component";
import { ToastComponent } from "~/pages/components/toast.component";

export interface PageFixtures {
  loginPage: LoginPage;
  merchantPage: MerchantPage;
  customerPage: CustomerPage;
  productPage: ProductPage;
  categoryPage: CategoryPage;
  employeePage: EmployeePage;
  userPage: UserPage;
  terminalPage: TerminalPage;
  transactionPage: TransactionPage;
  virtualTerminalPage: VirtualTerminalPage;
  headerComponent: HeaderComponent;
  leftMenuComponent: LeftMenuComponent;
  toastComponent: ToastComponent;
}

export const pagesTest = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  merchantPage: async ({ page }, use) => {
    await use(new MerchantPage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  employeePage: async ({ page }, use) => {
    await use(new EmployeePage(page));
  },
  userPage: async ({ page }, use) => {
    await use(new UserPage(page));
  },
  terminalPage: async ({ page }, use) => {
    await use(new TerminalPage(page));
  },
  transactionPage: async ({ page }, use) => {
    await use(new TransactionPage(page));
  },
  virtualTerminalPage: async ({ page }, use) => {
    await use(new VirtualTerminalPage(page));
  },
  headerComponent: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  leftMenuComponent: async ({ page }, use) => {
    await use(new LeftMenuComponent(page));
  },
  toastComponent: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },
});
