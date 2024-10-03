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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { SiteConfig } from "@/config/site";
import { useAuth } from '@apis/authen';
// Define the pages array
const pages = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/login" },
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
  { name: "Pricing", href: "/pricing" },
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

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
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
      <NavbarContent justify="center" className="gap-20"> {/* Thay đổi từ gap-4 thành gap-8 */}
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
      <NavbarContent className="hidden md:flex ml-20" justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="ml-2 !flex gap-2">
          <Button
            as={Link}
            href="/login"
            className="text-default-500"
            radius="full"
            variant="light"
          >
            Login
          </Button>
          <Button
            as={Link}
            href="/signup"
            className="bg-foreground font-medium text-background"
            color="secondary"
            endContent={<Icon icon="solar:alt-arrow-right-linear" />}
            radius="full"
            variant="flat"
          >
            Get Started
          </Button>
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
          <Button fullWidth as={Link} href="/login" variant="faded">
            Login
          </Button>
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
