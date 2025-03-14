import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Toaster } from "react-hot-toast";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import SignIn from "./pages/auth/sign-in";
import { checkAccessToken } from "./utils/token";
import { useEffect, useState } from "react";
import { ProfileShow } from "./pages/profile";
import { AccountCircle } from "@mui/icons-material";
import { customDataProvider } from "./providers/BackendDataProvider";
import { UserList, UserShow } from "./pages/users";
import { Box, CircularProgress } from "@mui/material";
import { customAuthProvider } from "./providers/BackendAuthProvider";
import AuthModule from "./pages/auth/auth";
function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              dataProvider={customDataProvider}
              authProvider={customAuthProvider}
              resources={[
                {
                  name: "profile",
                  edit: () => null,
                  list: () => null,
                  meta: {
                    canDelete: false,
                    label: "Perfil",
                    icon: <AccountCircle />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  create: () => null,
                  edit: () => null,
                  show: "/users/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                // {
                //   name: "blog_posts",
                //   list: "/blog-posts",
                //   show: "/blog-posts/show/:id",
                //   create: "/blog-posts/create",
                //   edit: "/blog-posts/edit/:id",
                //   meta: {
                //     canDelete: true,
                //   },
                // },
              ]}
            >
              <Authenticated key="protected" fallback={<AuthModule />}>
                <Routes>
                  <Route
                    element={
                      <ThemedLayoutV2 Header={() => <Header sticky />}>
                        <Outlet />
                        <Toaster />
                      </ThemedLayoutV2>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts" />}
                    />

                    <Route path="/auth/*" element={<Navigate to="/" />} />
                    <Route path="/profile">
                      <Route index element={<ProfileShow />} />
                    </Route>
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      {/* <Route path="create" element={<BlogPostCreate />} />
                    <Route path="edit/:id" element={<BlogPostEdit />} /> */}
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Authenticated>
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
