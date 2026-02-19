# Role Context Selection - Implementation Guide

## Overview
This implementation adds a role context selection feature to your social media platform. When users sign in, they may have multiple role contexts (e.g., Platform Admin, Organization Admin, Team Member), and they need to select which role they want to use for their current session.

## Files Created/Modified

### 1. **New Files Created**

#### `components/role-selection-form.tsx`
A comprehensive form component that:
- Displays all available role contexts for the logged-in user
- Fetches and displays role details (title, description, scope)
- Fetches organization names for better UX
- Handles role context selection via API
- Stores the selected context and access token
- Navigates to the appropriate dashboard based on the selected role

#### `app/select-role/page.tsx`
A dedicated page route for role selection with a clean, centered layout.

#### `lib/role-utils.ts`
Utility functions for role-based operations:
- `getRouteForRoleContext()` - Determines the correct route based on role context
- `getRouteForRoleTitle()` - Legacy support for role title-based routing
- `getRoleScopeLabel()` - Gets user-friendly labels for role scopes
- `hasRoleContext()` - Checks if a user has a specific role context
- `isPlatformRole()`, `isOrganizationRole()`, `isSchoolRole()` - Helper functions

### 2. **Modified Files**

#### `app/contexts/AuthContext.tsx`
Enhanced to support the new sign-in response structure:
- Added `roleContexts` state to store available role contexts
- Added `requiresRoleSelection` flag
- Added `selectedRoleContext` to track the current role
- Updated `login()` method to accept and store role contexts
- Added helper methods: `setRoleContexts()`, `setSelectedRoleContext()`
- Updated localStorage management for persistence

#### `components/login-form.tsx`
Updated to handle the new authentication flow:
- Stores role contexts and selection requirement flag
- Redirects to `/select-role` when role selection is required
- Uses `getRouteForRoleContext()` for consistent navigation
- Handles single role context scenario (direct login)

## How It Works

### Authentication Flow

1. **User Signs In**
   ```
   User enters credentials → API returns SignInResponseDto
   ```

2. **Response Handling**
   ```typescript
   interface SignInResponseDto {
     user: User;
     roleContexts: RoleContext[];
     accessToken?: string;  // Only present if single role context
     requiresRoleSelection: boolean;
   }
   ```

3. **Route Decision**
   - If `requiresRoleSelection === true` → Redirect to `/select-role`
   - If `requiresRoleSelection === false` → Direct navigation with token

4. **Role Selection** (when required)
   - Display all available role contexts
   - User clicks on a role context card
   - Call `authControllerSelectRoleContext` API
   - Receive access token and selected context
   - Navigate to appropriate dashboard

### Navigation Logic

The system determines the dashboard route based on role context:

```typescript
if (context.organizationId) {
  // Organization-scoped role → /organization
  router.push("/organization");
} else if (context.schoolId) {
  // School-scoped role → /school
  router.push("/school");
} else {
  // Platform-level role → /admin
  router.push("/admin");
}
```

## Key Features

### 1. **Visual Design**
- Clean, modern UI with gradient cards
- Icons based on role type (Building2, School, Shield, Users)
- Smooth hover effects and animations
- Loading states during selection

### 2. **Data Enrichment**
- Fetches role details to display proper titles and descriptions
- Fetches organization names for better context
- Shows role scope badges (Platform, Organization, School)

### 3. **Error Handling**
- Graceful handling of missing user data
- Empty state for users with no role contexts
- API error messages via toast notifications
- Fallback navigation to login page

### 4. **Persistence**
- Role contexts stored in localStorage
- Selected role context persists across sessions
- Access token properly stored and retrieved

## API Endpoints Used

1. **Sign In**
   ```
   POST /api/auth/sign-in
   Response: SignInResponseDto
   ```

2. **Select Role Context**
   ```
   POST /api/auth/select-role-context
   Body: { userId, roleContextId }
   Response: SelectRoleContextResponseDto
   ```

3. **Get All Roles**
   ```
   GET /api/roles
   Response: Role[]
   ```

4. **Get Organization**
   ```
   GET /api/organizations/:id
   Response: Organization
   ```

## Usage Example

### User with Multiple Roles

```typescript
// After login, user sees role selection page with options like:

┌─────────────────────────────────────────┐
│  Platform Admin                         │
│  Platform-level access                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Organization Admin                     │
│  Organization: Acme Corp                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Team Member                            │
│  Organization: Tech Startup Inc         │
└─────────────────────────────────────────┘
```

### Accessing Role Information

```typescript
import { useAuth } from "@/app/contexts/AuthContext";

function MyComponent() {
  const { 
    user,
    roleContexts,
    selectedRoleContext,
    requiresRoleSelection 
  } = useAuth();

  // Check if user has specific role
  const hasOrgAdmin = roleContexts.some(
    ctx => ctx.roleId === 2 && ctx.organizationId
  );

  return (
    <div>
      <p>Current Role: {selectedRoleContext?.roleId}</p>
    </div>
  );
}
```

## Customization

### Adding New Role Scopes

To add support for new role scopes (e.g., "Department"):

1. Update `getRouteForRoleContext()` in `lib/role-utils.ts`
2. Add corresponding icon in `getRoleIcon()` in role-selection-form
3. Create the new dashboard route (e.g., `/department/page.tsx`)

### Styling

All components use shadcn/ui components and Tailwind CSS. Customize by:
- Modifying Tailwind classes in component files
- Updating theme colors in `tailwind.config.js`
- Adding custom styles in component-specific CSS

## Testing Checklist

- [ ] User with single role context logs in directly
- [ ] User with multiple role contexts sees selection page
- [ ] Role selection stores token and navigates correctly
- [ ] Organization names display properly
- [ ] Role descriptions and scopes are visible
- [ ] "Back to Login" button clears state and redirects
- [ ] Page refreshes maintain authentication state
- [ ] Error states display appropriately

## Future Enhancements

1. **Role Switching**: Add ability to switch roles without logging out
2. **Recent Roles**: Remember last selected role per organization
3. **Role Permissions**: Display specific permissions for each role
4. **Organization Logos**: Show organization logos in selection cards
5. **Search/Filter**: Add search for users with many role contexts
6. **Favorites**: Allow users to mark frequently used roles

## Troubleshooting

### Issue: Role selection page shows "No role contexts available"
**Solution**: Check that roleContexts are properly stored in AuthContext after login

### Issue: Navigation goes to wrong dashboard
**Solution**: Verify role context IDs match the expected navigation logic in `role-utils.ts`

### Issue: Organization names not showing
**Solution**: Ensure organization API endpoint is accessible and returns correct data structure

### Issue: Access token not persisting
**Solution**: Check localStorage is working and token is being set via `setToken()`
