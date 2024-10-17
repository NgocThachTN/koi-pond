import { Chip } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { type SidebarItem, SidebarItemType } from "./sidebar";
import TeamAvatar from "./team-avatar.tsx";



export const items: SidebarItem[] = [
  {
    key: "dashboard",
    href: "/manager/dashboard",
    icon: "solar:home-2-linear",
    title: "Dashboard",
  },
  {
    key: "user-management",
    title: "User Management",
    icon: "solar:users-group-two-rounded-outline",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "staff",
        href: "/manager/user-management/staff",
        icon: "solar:user-id-linear",
        title: "Staff",
      },
      {
        key: "customers",
        href: "/manager/user-management/customers",
        icon: "solar:user-rounded-linear",
        title: "Customers",
      },
    ],
  },
  {
    key: "request-management",
    title: "Request Management",
    icon: "solar:clipboard-list-linear",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "design-and-sample",
        href: "/manager/request-management/design-and-sample",
        icon: "solar:palette-linear",
        title: "Design & Sample",
        endContent: (
          <Chip size="sm" variant="flat">
            New
          </Chip>
        ),
      },
      {
        key: "maintenance",
        href: "/manager/request-management/maintenance",
        icon: "solar:wrench-linear",
        title: "Maintenance",
      },
    ],
  },
  // {
  //   key: "feedback-management",
  //   href: "/manager/feedback-management",
  //   icon: "solar:chat-round-dots-linear",
  //   title: "Feedback Management",
  // },
  {
    key: "contract-management",
    href: "/manager/contract-management",
    icon: "solar:document-linear",
    title: "Contract Management",
  },
  // {
  //   key: "maintenance-management",
  //   href: "/manager/maintenance-management",
  //   icon: "solar:chart-2-linear",
  //   title: "Maintenance Management",
  // },

];
