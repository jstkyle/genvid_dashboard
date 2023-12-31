import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { useRouter } from "next/router";
import SvgComponent from "./fluenci_logo";

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <SvgComponent />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Dashboard"
              icon={<HomeIcon />}
              isActive={router.pathname === "/dashboard"}
              href="dashboard"
            />
            <SidebarItem
              isActive={router.pathname === "/accounts"}
              title="Avatars"
              icon={<AccountsIcon />}
              href="accounts"
            />
            <SidebarItem
              isActive={router.pathname === "/classroom"}
              title="Classroom"
              icon={<PaymentsIcon />}
              href="classroom"
            />
            <CollapseItems
              icon={<BalanceIcon />}
              items={["Banks Accounts", "Credit Cards", "Loans"]}
              title="Balances"
            />
            <SidebarItem
              isActive={router.pathname === "/developers"}
              title="Developers"
              icon={<DevIcon />}
              href="developers"
            />
            <SidebarItem
              isActive={router.pathname === "/stream-video"}
              title="stream-video"
              icon={<DevIcon />}
              href="stream-video"
            />
            <SidebarItem
              isActive={router.pathname === "/devPlayer"}
              title="devPlayer"
              icon={<DevIcon />}
              href="devPlayer"
            />
            <SidebarItem
              isActive={router.pathname === "/devPlayer2"}
              title="devPlayer2"
              icon={<DevIcon />}
              href="devPlayer2"
            />
            <SidebarItem
              isActive={router.pathname === "/settings"}
              title="Settings"
              icon={<SettingsIcon />}
            />
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
