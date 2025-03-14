import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Toaster } from "react-hot-toast";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/mui";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
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
import { ProfileShow } from "./pages/profile";
import { AccountCircle } from "@mui/icons-material";
import { customDataProvider } from "./providers/BackendDataProvider";
import { UserList, UserShow } from "./pages/users";
import { customAuthProvider } from "./providers/BackendAuthProvider";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import { SideSmallAthorIcon } from "./pages/auth/components/custom-icons";
import ProfileEdit from "./pages/profile/edit";
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
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="dashboard"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Outlet />
                    </Authenticated>
                  }
                >
                  <Route
                    element={
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            icon={
                              collapsed ? (
                                <SideSmallAthorIcon />
                              ) : (
                                <SideSmallAthorIcon />
                              )
                            }
                            text="Athor Backoffice"
                          />
                        )}
                        Header={() => <Header sticky />}
                      >
                        <Outlet />
                        <Toaster />
                      </ThemedLayoutV2>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="/" />}
                    />

                    <Route path="/profile">
                      <Route index element={<ProfileShow />} />
                      <Route path="edit" element={<ProfileEdit />} />
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
                </Route>
                <Route
                  element={<Authenticated key="auth" fallback={<Outlet />} />}
                >
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
