"use client";

import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Divider,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { SiteConfig } from "@/config/site";

// Define the pages array
const pages = [
  { name: "Home", href: "/homeuser" },
  { name: "Features", href: "/docsuser" },
  { name: "Blog", href: "/bloguser" },
  { name: "About Us", href: "/aboutuser" },
  { name: "Pricing", href: "/pricinguser" },
];

const menuItems = [
  "About",
  "Blog",
  "Customers",
  "Pricing",
  "Enterprise",
  "Changelog",
  "Documentation",
  "Contact Us",
];

export const NavbarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    
    console.log("Logout clicked");
  };

  return (
    <NextUINavbar
      classNames={{
        base: cn("border-default-100", {
          "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
        }),
        wrapper: "w-full justify-center",
        item: "hidden md:flex",
      }}
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      position="sticky"
    >
      {/* Left Content */}
      <NavbarBrand>
        <div className="rounded-full bg-foreground text-background">
          <Logo />
        </div>
        <span className="ml-2 text-small font-medium">KoiPond</span>
      </NavbarBrand>

      {/* Center Content */}
      <NavbarContent justify="center">
        {pages.map((page) => (
          <NavbarItem key={page.name}>
            <Link
              className={cn("text-default-500", {
                "text-foreground": page.name === "Customers",
              })}
              href={page.href}
              size="sm"
              aria-current={page.name === "Customers" ? "page" : undefined}
            >
              {page.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Content */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="ml-2 !flex gap-2">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Avatar
                  as="button"
                  color="secondary"
                  size="md"
                  src="https://i.pinimg.com/564x/be/28/b7/be28b725c5e7d746f9e5448bac55f853.jpg"
                />
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="User menu actions"
              onAction={(actionKey) => console.log({ actionKey })}
            >
              <DropdownItem
                key="profile"
                className="flex flex-col justify-start w-full items-start"
              >
                <p>Welcome, </p>
                <p>Saito Asuka</p>
              </DropdownItem>
              <DropdownItem key="settings">View Profile</DropdownItem>
              <DropdownItem key="team_settings">My Orders</DropdownItem>
              <DropdownItem key="help_and_feedback">Feedback</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onPress={handleLogout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
       
      <NavbarMenuToggle className="text-default-400 md:hidden" />

      <NavbarMenu className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        {pages.map((page) => (
          <NavbarMenuItem key={page.name}>
            <Link
              className="mb-2 w-full text-default-500"
              href={page.href}
              size="md"
            >
              {page.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <ThemeSwitch />
        </NavbarMenuItem>
        <NavbarMenuItem>
         
        </NavbarMenuItem>
        <NavbarMenuItem className="mb-4">
          <Button fullWidth as={Link} className="bg-foreground text-background" href="/signup">
            Get Started
          </Button>
        </NavbarMenuItem>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="mb-2 w-full text-default-500" href="#" size="md">
              {item}
            </Link>
            {index < menuItems.length - 1 && <Divider className="opacity-50" />}
          </NavbarMenuItem>
          
        ))} 
      </NavbarMenu>
      
    </NextUINavbar>
  );
};