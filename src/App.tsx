import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '@apis/authen'; // Đảm bảo đường dẫn này chính xác

import IndexPage from "@/pages/home/index";
import DocsPage from "@/pages/Docs/docs";
import PricingPage from "@/pages/Pricing/pricing";
import BlogPage from "@/pages/Blog/blog";
import AboutPage from "@/pages/About/about";
import LoginPage from "@/pages/Login/login";
import SignUpPage from "@/pages/Singup/signup";
import ServicesPage from "@/pages/Services/services";
import UserPage from "./pages/home/homeuser";
import Blog1Page from "./components/Blog/blog1";
import Blog2Page from "./components/Blog/blog2";
import Blog3Page from "./components/Blog/blog3"; 
import BlogPageUser from "./pages/Blog/bloguser";
import PricingPageUser from "@/pages/Pricing/pricinguser";
import AboutPageUser from "./pages/About/aboutuser";
import DocsPageUser from "@/pages/Docs/docsuser"; 
import OrdersPage from "./pages/Orders/Orders";
import AdminPage from "./pages/Admin/admin";
import StaffPage from "./pages/Staff/staff";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/homeuser" replace />;
  }
  
  return <IndexPage />;
};

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/homeuser');
    }
  }, [isAuthenticated, navigate]);

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
                    src="https://i.pinimg.com/564x/14/8d/0e/148d0e0f3a55b0c93bf04d85b6f9e3e9.jpg"
                  />
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu
                aria-label="User menu actions"
                onAction={(actionKey) => console.log({ actionKey })}
              >
                <DropdownItem key="profile">
                  <p>Welcome, </p>
                  <p>Saito Asuka</p>
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
                <DropdownItem key="help_and_feedback" onPress={handleOpenFeedback}>
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

      <ProfileModal isOpen={isProfileOpen} onClose={onProfileClose} />
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <FeedbackModal isOpen={isFeedOpen} onClose={onFeedClose} />
    </>
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/homeuser" /> : <IndexPage />} />
      
      {/* Guest routes */}
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing"/>
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<ServicesPage />} path="/services" />

      {/* Guest Blog */}
      <Route element={<Blog1Page/>} path="/blog/blog1" />
      <Route element={<Blog2Page/>} path="/blog/blog2" />
      <Route element={<Blog3Page/>} path="/blog/blog3" />

      {/* Protected User routes */}
      <Route element={isAuthenticated ? <UserPage /> : <Navigate to="/login" />} path="/homeuser" />
      <Route element={isAuthenticated ? <BlogPageUser /> : <Navigate to="/login" />} path="/bloguser" />
      <Route element={isAuthenticated ? <PricingPageUser /> : <Navigate to="/login" />} path="/pricinguser" />
      <Route element={isAuthenticated ? <AboutPageUser /> : <Navigate to="/login" />} path="/aboutuser" />
      <Route element={isAuthenticated ? <DocsPageUser /> : <Navigate to="/login" />} path="/docsuser" />
      <Route element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} path="/orders"/>

      {/* Admin Pages */}
      <Route element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} path="/admin" />
      <Route element={isAuthenticated ? <StaffPage /> : <Navigate to="/login" />} path="/staff"/>
    </Routes>
  );
}

export default App;
