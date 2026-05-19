# Theater App Architecture

## 1. Overview
The **Theater App** delivers a cinematic seat-reservation experience for iOS and Android through Expo and React Native. The client integrates with Firebase Authentication and Cloud Firestore (BaaS) to onboard users, surface curated theatrical productions, orchestrate seat selection in real time, and manage reservations. Administrators receive dedicated tooling to moderate user roles and maintain theater layouts.

## 2. Technology Stack
The solution is grounded in modern React Native tooling with full Expo and Firebase support.

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo SDK | 54.0.33 | Managed runtime, bundler, OTA updates |
| React Native | 0.81.5 | Native UI primitives and bridge |
| React | 19.1.0 | Declarative component model (hooks) |
| Firebase JS SDK | 12.13.0 | Authentication + Cloud Firestore client |
| @react-navigation/native | 7.2.4 | Navigation container and theming |
| @react-navigation/native-stack | 7.15.0 | Native stack transitions |
| @react-native-async-storage/async-storage | 2.2.0 | Auth state persistence |
| expo-status-bar | ~3.0.9 | Status bar styling |
| react-native-screens | ~4.16.0 | Native-backed navigation performance |
| react-native-safe-area-context | ~5.6.0 | Safe area calculations |
| @expo/vector-icons | ^15.0.3 | Ionicons-based iconography |

## 3. Layered Architecture
The app follows a multi-layer architecture to enforce separation of concerns:

- **Presentation Layer**: Components and screens in `src/components` and `src/screens` render UI, manage interaction, handle local state, and provide UX feedback (loading states, alerts, empty states).
- **Navigation Layer**: `src/navigation/AppNavigator.js` coordinates the Native Stack, defines initial routes, hides headers for immersive layouts, and enforces role-based redirects.
- **Services Layer**: Modules under `src/services` encapsulate Firestore/Auth CRUD (authService, userService, showService, reservationService), supplying a reusable API and simplifying testing.
- **Firebase/Data Layer**: `firebase.js` initializes the Firebase app, enables React Native persistence via `initializeAuth` + `getReactNativePersistence(AsyncStorage)`, and exports `auth` / `db` references.
- **Theme System**: `src/theme/colors.js`, `typography.js`, and `spacing.js` provide a cinematic palette, typography scales, and spacing tokens to keep every screen visually coherent.

Clear interfaces between layers allow UI, navigation flows, and backend logic to evolve independently.

## 4. Repository Structure
The repository organizes the codebase by domain and artifact type.

```text
src/
├─ components/          # AppButton, AppInput, EmptyState, LoadingState, FloatingBackButton
├─ navigation/          # AppNavigator (Native Stack configuration)
├─ screens/             # Login, Register, Home, ShowDetails, Reservation, Profile, Admin*
├─ services/            # authService, userService, showService, reservationService
├─ theme/               # Design tokens (colors, typography, spacing)
assets/
├─ screenshots/         # login.png, register.png, home.png, details.png, reservation.png, profile.png
App.js                  # NavigationContainer + StatusBar setup
firebase.js             # Firebase bootstrap & exports
architecture-explaining.md  # This document
```

The topology helps teams quickly locate business logic, extend UI, and integrate new services without cross-cutting edits.

## 5. Navigation & Flow Orchestration
Navigation relies on a Native Stack with `slide_from_right` transitions and a shared cinematic background.

- **Initial Route**: `Login`, which validates authentication status and user role.
- **Authentication Flow**: `Login → Register → Home`. Successful auth/registration replaces the stack with the appropriate home screen.
- **User Flow**: `Home → ShowDetails → Reservation`, with optional access to `Profile` for active reservations and the ability to jump back into `Reservation` to edit seats.
- **Admin Flow**: When `userData.role === "admin"`, navigation redirects to `AdminHome`, branching into `AdminUsers` (role/status management) and `AdminTheatres` (seat layout management).
- **Global Back Navigation**: `FloatingBackButton` supplies a consistent overlay back action on full-screen scenes.
- **Logout Handling**: Both user and admin paths reset the navigation stack to prevent returning to protected screens.

## 6. Screen Responsibilities
| Screen | Primary Responsibilities |
|--------|--------------------------|
| **LoginScreen** | Validate credentials, invoke `loginUser`, fetch profile (`getUserProfile`), handle blocked accounts, and redirect based on role. |
| **RegisterScreen** | Create account (`registerUser`), seed Firestore profile (`createUserProfile`), surface success alerts, and navigate to `Home`. |
| **HomeScreen** | Fetch shows (`getShows`), render cinematic cards, offer CTA into `ShowDetails`, and provide shortcuts to `Profile` and logout. |
| **ShowDetailsScreen** | Present show metadata from route params, trigger `Reservation`, and display the overlay back button. |
| **ReservationScreen** | Render dynamic seat map (rows/columns), synchronize reservations (`getActiveReservationsForShow`), create/update reservations (`createReservation` / `updateReservation`), compute totals, and navigate back once saved. |
| **ProfileScreen** | Retrieve active reservations (`getUserActiveReservations`), display details, and provide CTAs to modify seats or cancel (`cancelUserReservation`). |
| **AdminHomeScreen** | Act as the admin hub with themed presentation, expose admin modules, and handle logout via `logoutUser`. |
| **AdminUsersScreen** | List users (`getAllUsers`), show role/status badges, promote/demote (`updateUserRole`), and block/unblock (`updateUserStatus`) with self-protection checks. |
| **AdminTheatresScreen** | Fetch shows (`getShows`), allow inline editing of `rows`/`columns`, validate numeric input, and persist layout changes via `updateShowLayout`. |

## 7. Service & Data Flow
Service abstraction keeps Firestore logic outside the UI:

1. **Authentication** (`authService.js`): Wraps Firebase Auth operations (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`).
2. **User Profiles** (`userService.js`): Creates profiles, retrieves lists, updates roles/statuses, and rehydrates user data during login.
3. **Shows** (`showService.js`): Supplies `getShows` (defaulting `rows=10`, `columns=12` when absent) and `updateShowLayout` for admin adjustments.
4. **Reservations** (`reservationService.js`): Queries active reservations per user/show, creates/updates/cancels documents with timestamps and total-price calculations.

With this arrangement, screens simply call services and translate responses into UI state or alerts.

## 8. Firebase Data Model
```js
// users/{uid}
{
  name: "Maria Papadopoulou",
  email: "maria@example.com",
  role: "user" | "admin",
  status: "active" | "blocked",
  createdAt: Timestamp
}

// shows/{showId}
{
  title: "Oidipous Tyrannos",
  theatre: "National Theatre",
  location: "Athens",
  duration: 120,
  price: 18,
  description: "Performance synopsis",
  rows: 10,
  columns: 12
}

// reservations/{reservationId}
{
  userId: "uid-123",
  showId: "show-456",
  showTitle: "Oidipous Tyrannos",
  theatre: "National Theatre",
  price: 18,
  seats: ["B5", "B6"],
  totalPrice: 36,
  status: "active" | "cancelled",
  createdAt: Timestamp,
  updatedAt?: Timestamp,
  cancelledAt?: Timestamp
}
```

- Admins mutate `rows` / `columns` to align seat maps with each venue.
- Reservations reference both user and show to support targeted queries.
- Timestamps provide an audit trail and sort order.

## 9. Seat Map Rendering Pipeline
1. Read `rows` / `columns` from the show document (fallback 8×9).
2. Measure available width (`useWindowDimensions`) and derive seat dimensions (min 20px, max 30px) with dynamic radius and font size.
3. Build row labels (`A..`) and column labels (`1..`).
4. Populate `reservedSeats` from other users’ reservations and `selectedSeats` from the current user’s reservation (if present).
5. Seat toggling skips reserved seats and updates local state accordingly.
6. Submit calls `createReservation` or `updateReservation`, recalculates totals, and navigates back to `Home`.

This approach paves the way for future real-time updates through snapshot listeners.

## 10. Shared Components & Theme System
- **AppButton / AppInput**: Reusable CTAs and text fields with consistent padding, shadows, and icon integration.
- **EmptyState / LoadingState**: Unified messaging for list states across Home, Profile, and admin views.
- **FloatingBackButton**: Overlay control using Ionicons for immersive back gestures.
- **Theme Tokens**: `colors.js`, `typography.js`, and `spacing.js` maintain the cinematic aesthetic throughout the app.

## 11. Error Handling & UX Strategy
- All asynchronous operations run inside `try/catch` blocks with contextual `Alert` feedback.
- Buttons and actionable elements disable during network requests (`loading` state, opacity tweaks).
- `ActivityIndicator` surfaces while fetching lists (e.g., Home shows).
- Empty states provide clear guidance when data sets return zero items.
- Admin actions enforce protective checks (no self demotion/block) to prevent misuse.

## 12. Security & Authorization Considerations
- Firebase Authentication removes the need for custom password storage and leverages secure token handling.
- Recommended Firestore Security Rules:
  - Users can read/update only their profile and reservation documents.
  - Only admins can execute `updateUserRole`, `updateUserStatus`, and `updateShowLayout`.
  - Reservation writes must validate ownership (`auth.uid`).
- AsyncStorage-backed persistence and Firebase token refresh reduce login friction while preserving security.

## 13. Scalability & Future Work
- **Realtime listeners** (`onSnapshot`) for immediate seat availability updates.
- **Firestore transactions** to atomically reserve seats and avoid race conditions.
- **Cloud Functions** for server-side validation, notifications, or analytics pipelines.
- **Payments integration** (Stripe) to elevate reservations into paid tickets.
- **Analytics instrumentation** (Firebase Analytics, Amplitude) to monitor funnels and engagement.
- **State management uplift** (React Query / Zustand) for caching and offline-first workflows.
- **TypeScript migration** for stronger typing and improved developer experience.

## 14. Conclusion
The Theater App fuses the Expo/React Native ecosystem with Firebase’s managed backend to deliver a cinematic reservation experience. Its layered architecture, reusable services, and cohesive theming guarantee maintainability and unlock future expansion. Admin tooling and detailed documentation make the project suitable for academic showcases and ready for production-grade evolution.
