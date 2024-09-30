import { Route, Routes } from "react-router-dom";

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
function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing"/>
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<SignUpPage />} path="/signup" />
      <Route element={<ServicesPage />} path="/services" />
      <Route element={<UserPage/>} path="/homeuser" />
      <Route element={<Blog1Page/>} path="/blog/blog1" />
      <Route element={<Blog2Page/>} path="/blog/blog2" />
      <Route element={<Blog3Page/>} path="/blog/blog3" />
      <Route element={<BlogPageUser/>} path="/bloguser" />
      <Route element={<PricingPageUser/>} path="/pricinguser" />
      <Route element={<AboutPageUser/>} path="/aboutuser" />
      <Route element={<DocsPageUser/>} path="/docsuser" />

    </Routes>
  );
}

export default App;
