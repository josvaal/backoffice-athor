// COMMIT
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Toaster } from "react-hot-toast";
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
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
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { ProfileShow } from "./pages/profile";
import {
  AccountCircle,
  AdminPanelSettings,
  Fingerprint,
  Group,
  PermIdentity,
} from "@mui/icons-material";
import { customDataProvider } from "./providers/BackendDataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import { customAuthProvider } from "./providers/BackendAuthProvider";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import { SideSmallAthorIcon } from "./pages/auth/components/custom-icons";
import ProfileEdit from "./pages/profile/edit";
import { Sidebar } from "./components";
import { RoleCreate, RoleEdit, RoleList, RoleShow } from "./pages/roles";
import { PermissionList, PermissionShow } from "./pages/permissions";

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
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <Group />,
                    label: "Usuarios",
                  },
                },
                {
                  name: "permissions",
                  list: "/permissions",
                  create: () => null,
                  edit: () => null,
                  show: "/permissions/show/:id",
                  meta: {
                    canDelete: false,
                    icon: <Fingerprint />,
                    label: "Permisos",
                  },
                },
                {
                  name: "roles",
                  list: "/roles",
                  create: "/roles/create",
                  edit: "/roles/edit/:id",
                  show: "/roles/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <AdminPanelSettings />,
                    label: "Roles",
                  },
                },
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
                        Sider={() => (
                          <ThemedSiderV2
                            render={({ items, logout, collapsed }) => {
                              return (
                                <Sidebar
                                  items={items}
                                  logout={logout}
                                  collapsed={collapsed}
                                />
                              );
                            }}
                          />
                        )}
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
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>
                    <Route path="/roles">
                      <Route index element={<RoleList />} />
                      <Route path="create" element={<RoleCreate />} />
                      <Route path="edit/:id" element={<RoleEdit />} />
                      <Route path="show/:id" element={<RoleShow />} />
                    </Route>
                    <Route path="/permissions">
                      <Route index element={<PermissionList />} />
                      <Route path="show/:id" element={<PermissionShow />} />
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
