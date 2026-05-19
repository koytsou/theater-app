# Θέατρο App / Theater App

A cinematic mobile application for theatre ticket reservations, built with Expo, React Native, Firebase Authentication, and Cloud Firestore.
![Expo](https://img.shields.io/badge/Expo-54.0.0-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb?style=for-the-badge&logo=react&logoColor=06192D)
![Firebase](https://img.shields.io/badge/Firebase-Authentication%20%26%20Firestore-ffca28?style=for-the-badge&logo=firebase&logoColor=DD2C00)
![License](https://img.shields.io/badge/Status-Academic%20Project-4c1?style=for-the-badge)
Το Θέατρο App είναι μια κινηματογραφική εφαρμογή κράτησης εισιτηρίων θεάτρου για κινητές συσκευές, σχεδιασμένη με Expo και React Native.

Η εφαρμογή επιτρέπει στους χρήστες να:

* περιηγούνται σε διαθέσιμες παραστάσεις
* βλέπουν λεπτομέρειες
* επιλέγουν θέσεις μέσω διαδραστικού seat map
* δημιουργούν ή επεξεργάζονται κρατήσεις
* διαχειρίζονται το προφίλ και τις κρατήσεις τους

Η εφαρμογή χρησιμοποιεί:

* Firebase Authentication
* Cloud Firestore
* Role-based authorization
* Dynamic theatre layouts
* Responsive seat rendering
* Modular service architecture

---

# Χαρακτηριστικά

* Εγγραφή και σύνδεση χρηστών
* Firebase Authentication
* Persistent authentication state
* Προβολή διαθέσιμων θεατρικών παραστάσεων
* Αναλυτικές πληροφορίες παράστασης
* Διαδραστική επιλογή θέσεων
* Dynamic seat rendering
* Δημιουργία κράτησης
* Επεξεργασία κράτησης
* Ακύρωση κράτησης
* Προφίλ χρήστη με ενεργές κρατήσεις
* Firebase Firestore backend
* Firestore Security Rules
* Responsive cinematic UI
* Reusable components & modular architecture
* Admin dashboard
* User role management
* Block / Unblock users
* Dynamic theatre seat layouts

---

# Τεχνολογίες

| Τεχνολογία | Περιγραφή |
| --- | --- |
| Expo SDK 54 | Managed runtime και development environment για React Native |
| React Native 0.81 | Cross-platform mobile UI framework |
| React 19 | Declarative UI framework με hooks |
| Firebase Authentication | Authentication & JWT token lifecycle |
| Cloud Firestore | NoSQL cloud database |
| React Navigation | Native stack navigation |
| AsyncStorage | Persistent Firebase auth state |
| Expo Vector Icons | Iconography και UI enhancement |

---

# Αρχιτεκτονική Εφαρμογής

Η εφαρμογή ακολουθεί layered architecture με στόχο:

* maintainability
* scalability
* clean separation of concerns

---

## Presentation Layer

Οι React Native screens και components διαχειρίζονται:

* rendering UI
* user interactions
* local state
* loading/error states

---

## Navigation Layer

Το React Navigation Native Stack οργανώνει:

* authentication flow
* screen transitions
* route params
* protected navigation flows
* admin/user navigation

---

## Services Layer

Τα modules του src/services αναλαμβάνουν:

* Firestore CRUD operations
* Firebase abstraction
* reusable backend logic
* role-based authorization logic
* admin management operations
* theatre layout management

---

## Firebase Layer

Το firebase.js:

* αρχικοποιεί Firebase
* ενεργοποιεί authentication persistence
* παρέχει auth και db instances

---

## Theme System

Το src/theme περιέχει:

* colors
* typography
* spacing

ώστε να διατηρείται συνεπής cinematic αισθητική.

---

# Αρχιτεκτονική Ροή

```text
React Native UI
       ↓
Navigation Layer
       ↓
Services Layer
       ↓
Firebase SDK
       ↓
Firestore / Authentication

```

---

# Δομή Project

```txt
src/
├── components/
├── navigation/
├── screens/
│   ├── AdminHomeScreen.js
│   ├── AdminUsersScreen.js
│   ├── AdminTheatresScreen.js
│   ├── HomeScreen.js
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   ├── RegisterScreen.js
│   └── ReservationScreen.js
├── services/
│   ├── authService.js
│   ├── reservationService.js
│   ├── showService.js
│   └── userService.js
└── theme/

```

---

# Screenshots

## Login Screen

---

## Register Screen

---

## Home Screen

---

## Show Details Screen

---

## Reservation Screen

---

## Profile Screen

---

## Admin Home Screen

---

## Admin Users Screen

---

## Admin Theatre Layout Screen

---

# Admin System

Η εφαρμογή περιλαμβάνει πλήρες admin panel με role-based access control μέσω Firestore.

Ο admin χρήστης έχει πρόσβαση σε:

* Users Management
* Role Management
* Block / Unblock χρηστών
* Dynamic Theatre Layout configuration
* Responsive seat rendering system

---

## User Management

Ο admin μπορεί:

* να προβάλλει όλους τους χρήστες
* να κάνει promote users σε admin
* να αφαιρεί admin δικαιώματα
* να κάνει block / unblock χρήστες

---

## Theatre Management

Ο admin μπορεί:

* να αλλάζει δυναμικά το μέγεθος αιθουσών
* να τροποποιεί rows και columns
* να επηρεάζει real-time το seat rendering

Το seat map δημιουργείται δυναμικά μέσω:

```js
show.rows
show.columns

```

---

## Admin Demo Account

```txt
Email: admin@gmail.com
Password: 1234567890

```

---

# Role-based Navigation

```text
Login
   |
   |-- admin --> Admin Panel
   |
   |-- user ---> Home

```

---

# Authentication & Security

Η εφαρμογή χρησιμοποιεί Firebase Authentication για:

* email/password authentication
* JWT token management
* automatic token refresh
* session persistence

---

## Firestore Security Rules

Οι χρήστες:

* μπορούν να βλέπουν μόνο τα δικά τους reservations
* μπορούν να τροποποιούν μόνο τα δικά τους δεδομένα
* δεν έχουν write access στη συλλογή shows

Οι admins:

* μπορούν να διαχειρίζονται users
* μπορούν να αλλάζουν theatre layouts
* μπορούν να κάνουν moderation actions

---

## Παράδειγμα Firestore Rule

```js
function isAdmin() {
  return request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
}

```

---

# Σύστημα Κρατήσεων

Η διαδικασία κράτησης ακολουθεί την παρακάτω ροή:

1. Ανάκτηση ενεργών κρατήσεων από Firestore
2. Εντοπισμός κατειλημμένων θέσεων
3. Απενεργοποίηση reserved seats
4. Επιλογή θέσεων από τον χρήστη
5. Δημιουργία ή ενημέρωση κράτησης
6. Επαναφόρτωση UI

---

## Το σύστημα χρησιμοποιεί:

* Firestore queries
* dynamic seat rendering
* responsive layouts
* state synchronization
* loading protection
* reusable services

---

# Firebase Collections

## users

```js
{
  name: "Maria",
  email: "maria@example.com",
  role: "user", // or "admin"
  status: "active", // or "blocked"
  createdAt: Timestamp
}

```

---

## shows

```js
{
  title: "Οιδίπους Τύραννος",
  theatre: "Εθνικό Θέατρο",
  location: "Αθήνα",
  duration: 120,
  price: 18,
  rows: 8,
  columns: 9,
  description: "Αρχαία τραγωδία"
}

```

---

## reservations

```js
{
  userId: "uid",
  showId: "showId",
  seats: ["A1", "A2"],
  totalPrice: 36,
  status: "active",
  createdAt: Timestamp
}

```

---

# Εγκατάσταση

## 1. Clone repository

```bash
git clone <repository-url>

```

---

## 2. Install dependencies

```bash
npm install

```

---

## 3. Start Expo

```bash
npx expo start

```

---

## 4. Run on device

* Expo Go
* Android Emulator
* iOS Simulator

---

# Firebase Setup

## Authentication

Ενεργοποιήστε:

* Email/Password provider

---

## Firestore

Δημιουργήστε:

* users collection
* shows collection
* reservations collection

---

## firebase.js

Προσθέστε το δικό σας Firebase configuration:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
};

```

---

# Error Handling & UX

Η εφαρμογή περιλαμβάνει:

* try/catch handling
* loading indicators
* disabled actions during requests
* localized alerts
* empty states
* responsive layouts
* protected admin flows

---

# Μελλοντικές Βελτιώσεις

* Realtime Firestore listeners (onSnapshot)
* QR ticket generation
* Stripe payments
* Push notifications
* Analytics integration
* TypeScript migration
* React Query caching
* Firestore transactions
* Realtime admin updates
* Reservation analytics dashboard

---

# Ακαδημαϊκό Πλαίσιο

Η εφαρμογή αναπτύχθηκε στο πλαίσιο του μαθήματος:

## Mobile & Distributed Systems (CN6035)

Στόχος του project ήταν η κατανόηση:

* distributed mobile systems
* cloud backend services
* authentication & authorization
* remote database communication
* state consistency
* mobile UI/UX architecture

---

# Πρόσθετη Τεκμηρίωση

* [Architecture Documentation]()
* [Firebase Documentation]()
* [Expo Documentation]()

---

# Άδεια Χρήσης

Το project δημιουργήθηκε για:

* εκπαιδευτικούς σκοπούς
* ακαδημαϊκή αξιολόγηση
* portfolio showcase

---

# Επίλογος

Το Θέατρο App παρουσιάζει μια σύγχρονη προσέγγιση ανάπτυξης distributed mobile εφαρμογών με React Native και Firebase Backend-as-a-Service.

Η modular αρχιτεκτονική, το cinematic UI, το responsive reservation system και ο σαφής διαχωρισμός layers καθιστούν το project κατάλληλο τόσο για ακαδημαϊκή αξιολόγηση όσο και για επαγγελματικό portfolio showcase.
