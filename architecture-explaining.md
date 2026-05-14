# Theater App Architecture

## 1. Overview
Theater App is a cinematic theatre ticket reservation mobile application delivered via Expo for iOS and Android. It operates as a distributed client application that integrates with Firebase Authentication and Cloud Firestore as Backend-as-a-Service (BaaS) components. Users authenticate with email and password, browse curated theatrical performances, reserve seats in real time, and manage their reservations without maintaining proprietary backend infrastructure.

## 2. Technology Stack
The solution combines modern React Native tooling with Firebase-managed backend services.

| Technology | Purpose |
|------------|---------|
| Expo SDK 54 | Provides the managed runtime, bundler, and OTA updates for React Native. |
| React Native 0.81 | Cross-platform UI primitives and native bridge for mobile rendering. |
| React 19 | Declarative component model with hooks for stateful UI composition. |
| Firebase Authentication | Email/password identity management and session tokens. |
| Cloud Firestore | Document database for shows, users, and reservation records. |
| React Navigation Native Stack | Stack-based navigation with native-like transitions and gestures. |
| AsyncStorage Persistence | Secure, device-level storage for persisting Firebase auth state. |
| Expo Vector Icons | Iconography (Ionicons) supporting cinematic visual identity. |

## 3. Application Architecture
The architecture emphasizes clear separation of concerns and modular composition.

- **Presentation Layer**: React Native screens and shared components render cinematic UI, handle user input, and orchestrate local state through hooks.
- **Navigation Layer**: A Native Stack navigator (`NavigationContainer` + `createNativeStackNavigator`) manages screen transitions, route parameters, and authentication flow control.
- **Service Layer**: Firestore mutations and queries are encapsulated in service modules (e.g., `reservationService`) to consolidate data access logic and prepare for future reuse/testing.
- **Firebase/Data Layer**: `firebase.js` initializes the Firebase app, configures AsyncStorage-backed auth persistence, and exports typed references (`auth`, `db`) consumed throughout the app.
- **Theme System**: `src/theme` centralizes color palettes, typography, and spacing tokens so that the cinematic styling remains consistent across modules.

This layered approach keeps UI concerns decoupled from data access and platform initialization, facilitating testing and incremental feature growth.

## 4. Folder Structure
The repository maintains a concise, domain-driven structure.

```text
src/
|-- components/       # Reusable UI atoms and molecules (buttons, inputs, back button)
|-- navigation/       # Stack navigator configuration and navigation-level logic
|-- screens/          # Feature screens composing presentation + service interactions
|-- services/         # Firebase abstraction helpers for reservations and future modules
|-- theme/            # Shared design tokens (colors, typography, spacing)
```

This layout enables teams to locate features quickly, extend shared UI, and evolve services without cross-cutting edits.

## 5. Navigation Flow
The stack navigation flow is linear yet allows contextual drilling into details:

`Login -> Register -> Home -> ShowDetails -> Reservation -> Profile`

- On successful authentication or registration the stack advances to `Home`.
- Selecting a performance on `Home` pushes `ShowDetails`, which forwards show metadata through route parameters.
- `ShowDetails` launches `Reservation`, preserving the show payload for seat selection.
- `Profile` is reachable from `Home` and includes pathways back to `Reservation` for editing.
- Logging out invokes `navigation.reset` to clear history and return the user to `Login`, guarding against back navigation into protected screens.

## 6. Screen Responsibilities
### LoginScreen
- Captures email/password, toggles secure entry, and invokes `signInWithEmailAndPassword`.
- On success routes to `Home`; displays localized alerts for common auth errors.

### RegisterScreen
- Creates accounts via `createUserWithEmailAndPassword` and seeds a `users/{uid}` document.
- Mirrors cinematic styling while guiding new users into the authenticated flow.

### HomeScreen
- Fetches the `shows` collection (one-time snapshot) and renders cards within a `FlatList`.
- Provides shortcuts to `Profile` and logout while forwarding selected show metadata to `ShowDetails`.

### ShowDetailsScreen
- Receives the show payload through route params and renders a highlighted detail card.
- Offers navigation to `Reservation` with the original show context and presents the cinematic back button overlay.

### ReservationScreen
- Builds an 8x9 seat grid, marks reserved seats via Firestore lookups, and allows toggling selections.
- Creates or updates reservation documents, recalculating totals, and returns users to `Home` on completion.

### ProfileScreen
- Queries active reservations for the authenticated user and displays them in stylized cards.
- Enables editing existing reservations (navigate back to `Reservation`) and canceling via Firestore status updates.

## 7. Firebase Architecture
### Initialization (`firebase.js`)
- Initializes the Firebase app with Expo credentials.
- Configures `initializeAuth` alongside AsyncStorage persistence to retain sessions between launches.
- Exports `auth` and `db` references for uniform use across services and screens.

### Firestore Collections
- **`users`**: Stores profile metadata created during registration.
- **`shows`**: Read-only collection powering the discovery experience.
- **`reservations`**: Tracks seat selections, ticket pricing, statuses, and timestamps.

```js
// Example users/{uid}
{
  name: "Maria Papadopoulou",
  email: "maria@example.com",
  createdAt: Timestamp
}

// Example shows/{showId}
{
  title: "Οιδίπους Τύραννος",
  theatre: "Εθνικό Θέατρο",
  location: "Αθήνα",
  duration: 120,
  price: 18,
  description: "Κλασική τραγωδία σε σύγχρονη σκηνοθεσία"
}

// Example reservations/{reservationId}
{
  userId: "uid-123",
  showId: "show-456",
  showTitle: "Οιδίπους Τύραννος",
  seats: ["B5", "B6"],
  totalPrice: 36,
  status: "active",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 8. Reservation System Flow
1. **Fetch reservations**: `ReservationScreen` (and `reservationService`) query active reservations for the selected show.
2. **Detect reserved seats**: Seats held by other users populate `reservedSeats`, visually disabling them on the grid.
3. **Prevent reserved seat selection**: Seat toggles short-circuit when a seat is already reserved to maintain integrity.
4. **Create/update reservation**: Depending on whether the current user already has a reservation, the screen calls `createReservation` or `updateReservation` with new seat arrays and calculated totals.
5. **Refresh UI**: Upon success the flow navigates back to `Home`, where re-fetching reflects updated availability; `Profile` pulls fresh data on focus.

Because seat creation currently relies on non-transactional writes, simultaneous requests could create race conditions. Future improvements should leverage Firestore transactions or `runTransaction` to enforce atomic seat allocation and detect conflicts deterministically.

## 9. Shared Components & Theme System
- **AppButton**: Standardized primary/secondary CTA styling with loading indicators.
- **AppInput**: Icon-ready text fields ensuring consistent spacing and typography.
- **FloatingBackButton**: Cinematic back navigation overlay reused across stack screens with immersive backgrounds.
- **EmptyState / LoadingState**: Drop-in components for handling empty collections and asynchronous fetch states.
- **Theme files (`colors.js`, `typography.js`, `spacing.js`)**: Centralize palette and typographic scale so that screens remain visually coherent and easy to restyle.

## 10. Error Handling & UX
- Critical Firebase interactions reside inside `try/catch` blocks with contextual `Alert` messages for user feedback.
- Loading indicators (spinners, disabled buttons) prevent duplicate submissions and clarify async operations.
- Reservation and authentication flows disable CTA buttons while network requests are pending, reducing accidental double taps.
- Empty states offer reassuring messaging when data sets return zero results.

## 11. Scalability & Extensibility
- Service modules (e.g., `reservationService`) centralize Firestore interactions, priming the codebase for reuse and unit testing.
- The modular folder structure supports additional domains (e.g., analytics, payments) without disturbing core screens.
- Future migrations to TypeScript, Zustand, or React Query can occur incrementally because layers interface through clear contracts.
- Introduce caching or offline patterns by extending services with React Query or SWR wrappers while keeping the presentation layer agnostic.

## 12. Security Considerations
- Authentication relies on Firebase-managed credentials, reducing exposure to password handling.
- Firestore Security Rules should enforce user-specific access, permitting reads/writes only to documents referencing the authenticated `uid`.
- Reservation endpoints must validate that users can modify only their own reservations and prevent tampering with seat arrays.
- AsyncStorage persistence is guarded by Firebase token refresh lifecycle, keeping sessions secure while supporting quick re-entry.

## 13. Future Improvements
- Adopt realtime Firestore listeners (`onSnapshot`) for live seat availability and reservation updates.
- Wrap reservation writes in transactions or Cloud Functions to serialize seat allocation.
- Generate QR-coded tickets for on-site validation.
- Integrate payment processing (Stripe) to convert reservations into purchases.
- Add push notifications for reservation reminders or performance updates.
- Build an admin dashboard for show curation and reservation oversight.
- Instrument analytics (Firebase Analytics, Amplitude) to monitor engagement and conversion funnels.

## 14. Conclusion
Theater App couples Expo's rapid delivery with Firebase's managed backend to deliver a cohesive reservation experience. Its layered architecture, reusable components, and modular services promote maintainability, while the cinematic theme reinforces product identity. With the outlined scalability and security enhancements, the application is well positioned for production deployment and academic demonstration alike.
