# frontend

Based on the API provided, here's a suggested structure for the dashboard views organized into modules and submodules, considering roles and functionalities:

### 1. **Authentication Module (Auth)**
**Access:** All users
- **Login** (`/auth/login`)
- **Registration** (`/auth/register`)
- **My Profile** (`/auth/me`)
  - View profile
  - Update profile (with 15-day restriction) (`/auth/me [PUT]`)
- **Token Management**
  - Verify Token (`/token/verify`)
  - Refresh Token (`/token/refresh`)

---

### 2. **User Management Module (Users)**
**Access:** Admin/SuperAdmin
- **User List** (`/users/list`)
  - Search and filter
  - Bulk actions
- **User Details** (`/users/{id}`)
  - Personal information
  - Associated devices
  - Role assignments
- **User Operations**
  - Update User (`/users/update/{id}`)
  - Delete User (`/users/delete/{id}`) [SuperAdmin only]

---

### 3. **Roles and Permissions Module**
**Access:** SuperAdmin only
- **Roles List** (`/roles/list`)
- **Role Details** (`/roles/{id}`)
  - Associated users
  - Permissions
- **Role Operations**
  - Create Role (`/roles/create`)
  - Update Role (`/roles/update/{id}`)
  - Assign Role to User (`/roles/assign/user/{userId}/role/{roleId}`)
  - Remove Role from User (`/roles/deassign/user/{userId}/role/{roleId}`)
  - Delete Role (`/roles/delete/{id}`)

---

### 4. **Device Management Module**
**Access:** Admin/SuperAdmin
- **Device Inventory** (`/devices/list`)
  - Advanced filters (status, model, batch)
  - Quick actions (assign/deassign)
- **Device Details** (`/devices/{id}`)
  - Technical specifications
  - Assignment history
  - Event log (`/device-history/list`)
- **Device Operations**
  - Create Device (`/devices/create`)
  - Update Device (`/devices/update/{id}`)
  - Delete Device (`/devices/delete/{id}`)
  - Assign to User (`/devices/assign/user/{userId}/device/{deviceId}`)
  - Deassign from User (`/devices/deassign/user/{userId}/device/{deviceId}`)
  - Register Event (`/devices/{deviceId}/event/{eventTypeId}`)

---

### 5. **Event Management Module**
**Access:** Admin/SuperAdmin/User (limited)
- **Event Types** (`/event-type/list`)
  - Create/Update Event Types (`/event-type/create`, `/event-type/update/{id}`)
- **Event Logs** (`/events/list`)
  - Filter by device/user/type
  - Export functionality

---

### 6. **Configuration Module**
**Access:** SuperAdmin only
- **Device Models** (`/device-model/list`)
  - Create/Update Models
- **Device Statuses** (`/device-status/list`)
  - Configure status types
- **System Parameters**
  - API Configuration
  - Security Settings

---

### 7. **Reports and Analytics**
**Access:** Admin/SuperAdmin
- **Device History** (`/device-history/list`)
  - Timeline visualization
  - Pattern detection
- **User Activity**
  - Login history
  - Actions log
- **System Metrics**
  - API usage statistics
  - Error monitoring

---

### Navigation Structure (Sidebar)
```markdown
- Dashboard (Home)
- Authentication
  - Login
  - My Profile
- User Management
  - User List
  - Create User
- Device Management
  - Device Inventory
  - Register Device
  - Assignments
- Roles & Permissions
- Event Management
  - Event Types
  - Event Logs
- Configuration
  - Device Models
  - Status Types
- Reports
  - Device History
  - User Activity
```

---

### Role-Based Access Matrix
| Functionality               | User | Admin | SuperAdmin |
|-----------------------------|------|-------|------------|
| Profile Management          | ✔️   | ✔️    | ✔️         |
| User Management             | ❌   | ✔️    | ✔️         |
| Device Operations           | ❌   | ✔️    | ✔️         |
| Role Management             | ❌   | ❌    | ✔️         |
| System Configuration        | ❌   | ❌    | ✔️         |
| Event Registration          | ✔️   | ✔️    | ✔️         |
| Advanced Reports            | ❌   | ✔️    | ✔️         |

This structure maintains a clear hierarchy, follows API capabilities, and respects role-based permissions. Each view should include contextual help based on the API descriptions for user guidance.