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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  CardFooter,
  Image,
  Chip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { Logo } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { SiteConfig } from "@/config/site";
import { ProfileModal } from "@/components/Profile/ProfileModal";
import { SettingsModal } from "@/components/Settings/SettingsModal";
import { FeedbackModal } from "@/components/Feedback/FeedbackModal";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@apis/authen";
// Define the pages array
const pages = [
  { name: "Home", href: "/homeuser" },
  { name: "Services", href: "/docsuser",},
  { name: "Blog", href: "/bloguser" },
  { name: "About Us", href: "/aboutuser" },
  {
    name: "Pricing",
    href: "#",
    dropdown: [
      { name: "Thiết kế có sẵn", href: "/pricinguser" },
      { name: "Bản vẽ theo yêu cầu", href: "/pricinguser2" },
    ],
  },
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
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {
    isOpen: isProfileOpen,
    onOpen: onProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isFeedOpen,
    onOpen: onFeedOpen,
    onClose: onFeedClose,
  } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const { logout, userEmail } = useAuth(); // Thay đổi này

  const handleLogout = async () => {
    setErrorMessage("");
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show error message to user)
    }
  };

  // Hàm để lấy tên hiển thị từ email
  const getDisplayName = (email: string | null) => {
    if (!email) return "Guest";
    // Lấy phần trước @ trong email để hiển thị
    return email.split("@")[0];
  };

  const handleViewProfile = () => {
    onProfileOpen();
  };

  const handleOpenSettings = () => {
    onSettingsOpen();
  };

  const handleOpenFeedback = () => {
    onFeedOpen();
  };

  const handleMyOrders = () => {
    window.location.href = "/orders";
  };

  return (
    <>
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
        <NavbarContent justify="center" className="gap-20">
          {pages.map((page) => (
            <NavbarItem key={page.name}>
              {page.dropdown ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                      endContent={<Icon icon="mdi:chevron-down" />}
                      radius="sm"
                      variant="light"
                    >
                      {page.name}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label={`${page.name} dropdown`}>
                    {page.dropdown.map((item) => (
                      <DropdownItem key={item.name}>
                        <Link href={item.href}>{item.name}</Link>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              ) : (
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
              )}
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right Content */}
        <NavbarContent className="hidden md:flex items-center" justify="end">
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>
          {/* Add a divider here */}
          <Divider orientation="vertical" className="h-6 mx-4" />
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                as="button"
                color="secondary"
                size="md"
                src="https://sohanews.sohacdn.com/160588918557773824/2020/12/17/photo-1-16081985708991024135226.jpg"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User menu actions"
              onAction={(actionKey) => console.log({ actionKey })}
            >
              <DropdownItem key="profile">
                <p>Welcome, </p>
                <p>{getDisplayName(userEmail)}</p> {/* Thay đổi này */}
              </DropdownItem>
              <DropdownItem key="view_profile" onPress={handleViewProfile}>
                View Profile
              </DropdownItem>
              <DropdownItem key="settings" onPress={handleOpenSettings}>
                Settings
              </DropdownItem>
              <DropdownItem key="team_settings" onPress={handleMyOrders}>
                My Orders
              </DropdownItem>
              <DropdownItem
                key="help_and_feedback"
                onPress={handleOpenFeedback}
              >
                Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onPress={() => handleLogout()}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          <NavbarMenuItem></NavbarMenuItem>
          <NavbarMenuItem className="mb-4">
            <Button
              fullWidth
              as={Link}
              className="bg-foreground text-background"
              href="/signup"
            >
              Get Started
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className="mb-2 w-full text-default-500" href="#" size="md">
                {item}
              </Link>
              {index < menuItems.length - 1 && (
                <Divider className="opacity-50" />
              )}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NextUINavbar>

      <ProfileModal isOpen={isProfileOpen} onClose={onProfileClose} />
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <FeedbackModal isOpen={isFeedOpen} onClose={onFeedClose} />
    </>
  );
};
