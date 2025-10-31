import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.jsx"; // 导入 AuthProvider
// import HomePage from "./routes/homePage/homePage.jsx";
// import PostPage from "./routes/postPage/postPage.jsx";
// import AuthPage from "./routes/authPage/authPage.jsx";
// import CreatePage from "./routes/createPage/createPage.jsx";
// import SearchPage from "./routes/searchPage/searchPage.jsx";
// import ProfilePage from "./routes/profilePage/profilePage.jsx";
// import MainLoyout from "./routes/layouts/mainLayout.jsx";

const HomePage = React.lazy(() => import("./routes/homePage/homePage.jsx"));
const PostPage = React.lazy(() => import("./routes/postPage/postPage.jsx"));
const AuthPage = React.lazy(() => import("./routes/authPage/authPage.jsx"));
const CreatePage = React.lazy(() =>import("./routes/createPage/createPage.jsx"));
const SearchPage = React.lazy(() =>import("./routes/searchPage/searchPage.jsx"));
const ProfilePage = React.lazy(() =>import("./routes/profilePage/profilePage.jsx"));
const MainLayout = React.lazy(() => import("./routes/layouts/mainLayout.jsx"));

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {" "}
        {/* 添加 AuthProvider */}
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePage />} />
              <Route path="/pin/:id" element={<PostPage />} />
              <Route path="/:username" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>{" "}
      {/* 结束 AuthProvider */}
    </QueryClientProvider>
  </StrictMode>
);
