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
  DeveloperBoard,
  Fingerprint,
  Group,
  MemoryTwoTone,
} from "@mui/icons-material";
import { customDataProvider } from "./providers/BackendDataProvider";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import { customAuthProvider } from "./providers/BackendAuthProvider";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import ProfileEdit from "./pages/profile/edit";
import { Sidebar } from "./components";
import { RoleCreate, RoleEdit, RoleList, RoleShow } from "./pages/roles";
import { PermissionList, PermissionShow } from "./pages/permissions";
import {
  DeviceCreate,
  DeviceEdit,
  DeviceList,
  DeviceShow,
} from "./pages/devices";
import {
  DeviceModelCreate,
  DeviceModelEdit,
  DeviceModelList,
  DeviceModelShow,
} from "./pages/device_models";
import {
  DeviceStatusCreate,
  DeviceStatusEdit,
  DeviceStatusList,
  DeviceStatusShow,
} from "./pages/device_statuses";

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
                {
                  name: "devices",
                  list: "/devices",
                  create: "/devices/create",
                  edit: "/devices/edit/:id",
                  show: "/devices/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <DeveloperBoard />,
                    label: "Dispositivos",
                  },
                },
                {
                  name: "device_models",
                  list: "/device_models",
                  create: "/device_models/create",
                  edit: "/device_models/edit/:id",
                  show: "/device_models/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <DeveloperBoard />,
                    label: "Modelos de dispositivos",
                  },
                },
                {
                  name: "device_statuses",
                  list: "/device_statuses",
                  create: "/device_statuses/create",
                  edit: "/device_statuses/edit/:id",
                  show: "/device_statuses/show/:id",
                  meta: {
                    canDelete: true,
                    icon: <DeveloperBoard />,
                    label: "Estado de dispositivos",
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
                            Title={({ collapsed }) => (
                              <ThemedTitleV2
                                collapsed={collapsed}
                                icon={
                                  collapsed ? (
                                    // <SideSmallAthorIcon />
                                    <MemoryTwoTone />
                                  ) : (
                                    // <SideSmallAthorIcon />
                                    <MemoryTwoTone />
                                  )
                                }
                                text="Athor Backoffice"
                              />
                            )}
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
                    <Route path="/devices">
                      <Route index element={<DeviceList />} />
                      <Route path="create" element={<DeviceCreate />} />
                      <Route path="edit/:id" element={<DeviceEdit />} />
                      <Route path="show/:id" element={<DeviceShow />} />
                    </Route>
                    <Route path="/device_models">
                      <Route index element={<DeviceModelList />} />
                      <Route path="create" element={<DeviceModelCreate />} />
                      <Route path="edit/:id" element={<DeviceModelEdit />} />
                      <Route path="show/:id" element={<DeviceModelShow />} />
                    </Route>
                    <Route path="/device_statuses">
                      <Route index element={<DeviceStatusList />} />
                      <Route path="create" element={<DeviceStatusCreate />} />
                      <Route path="edit/:id" element={<DeviceStatusEdit />} />
                      <Route path="show/:id" element={<DeviceStatusShow />} />
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
